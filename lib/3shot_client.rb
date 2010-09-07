require 'base64'
require 'rubygems'
require 'json'
require 'selenium/client'
require 'digest/sha1'


$batch_id = ENV['BATCH_ID']
$log_file = File.open("log/3shot_client_log.txt", "a+")
$log_file.puts "Logging for Snapshotter batch: #{$batch_id}"

$log_file.puts "ERROR: BATCH_ID was not specified in the environmental variable" unless $batch_id

class Snapshotter
  attr_reader :browser_name

  def initialize(options={})
    @username = options[:username]
    @access_key = options[:access_key]
    @browser_name = options[:browser]
    @browser_version = options[:browser_version]
    @folder  = options[:folder]

    @browser = Selenium::Client::Driver.new(
                                            :host => "saucelabs.com",
                                            :port => 4444,
                                            :browser =>
                                            {
                                              "username" => @username,
                                              "access-key" => @access_key,
                                              "os" => "Windows 2003",
                                              "browser" => @browser_name,
                                              "browser-version" => @browser_version,
                                              "job-name" => "3shots alpha [#{@browser_name}]"
                                            }.to_json,           
                                            :url => "http://www.saucelabs.com",
                                            :timeout_in_second => 90
                                            )

    @browser.start

    self.prep_folder
  end

  def get_snapshot_for(url)
    begin
      @browser.open(url)
      @browser.wait_for_page_to_load
      ss = Base64.decode64(@browser.capture_screenshot_to_string)
      File.open(filename(url), 'w') { |f| f.write(ss) }
      ss = Screenshot.new
      ss.url = url
      ss.browser_name = @browser_name
      ss.browser_version = @browser_version
      ss.screenshot_path = "screenshots/#{@folder}/#{Digest::SHA1.hexdigest(url)}_#{@browser_name}-#{@browser_version}.png"
      ss.batch_id = $batch_id
      ss.save
    rescue
      $log_file.puts "Error snapshotting browser: #{@browser} url: #{url}"
    end
  end
  
  def get_snapshots_for(urls)
    urls.each { |url| self.get_snapshot(url) }
  end

  def close
    @browser.close
    @browser.stop
  end

  def filename(url)
    "public/screenshots/#{@folder}/#{Digest::SHA1.hexdigest(url)}_#{@browser_name}-#{@browser_version}.png"
  end

  def prep_folder
    begin
      $log_file.puts "Making folder: public/screenshots/#{@folder}"
      Dir.mkdir "public/screenshots/#{@folder}"
    rescue
      $log_file.puts "ERROR Making folder"
    end
  end
end

def setup_workers(username, access_key, job, batch)
  config = {
    :folder => "#{job.id}_#{batch.id}",
    :username => username,
    :access_key => access_key
  }
  
  JSON.parse(job.browsers).collect do |browser|
    specific_config = config.dup
    specific_config.merge!({:browser => browser["name"], :browser_version => browser["version"]})
    $log_file.puts "\tNew worker: #{specific_config.inspect}"
    Snapshotter.new(specific_config)
  end
end

ARGV.each_with_index do |v, c|
  $log_file.puts "#{c}. #{v}"
end

username = "sgrove"
access_key = "ba8cd1fc-030e-4467-b134-63c15fbe3946"
batch = Batch.find $batch_id
job = Job.find batch.job_id
urls = JSON.parse job.urls
time = job.last_run

batch.status = "foreplay"
batch.save

$log_file.puts("#{username}  |  #{access_key}  |  #{job.browsers}  |  #{urls} ")

$log_file.puts "Prepping workers"
workers = setup_workers(username, access_key, job, batch)

batch.status = "intercourse"
batch.save
$log_file.puts "Snapshotting"
urls.each do |url|
  workers.each do |worker|
    $log_file.puts "\t#{url} [#{worker.browser_name}]"
    worker.get_snapshot_for url
  end
end

batch.status = "cleanup"
batch.save
workers.each { |worker| worker.close }

batch.status = "spent"
batch.save
$log_file.close
