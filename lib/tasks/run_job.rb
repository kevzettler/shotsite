require 'base64'
require 'rubygems'
require 'json'
require 'selenium/client'

$job_id = ENV['JOB_ID']
$log_file = File.open("log.txt", "a+")
$log_file.puts("Logging for Snapshotter job: #{$job_id}")

class Snapshotter
    attr_reader :browser_name

    def initialize(options={})
        @username = options[:username]
        @access_key = options[:access_key]
        @browser_name = options[:browser]
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
                "job-name" => "Snapshotter alpha [#{@browser_name}]"
            }.to_json,           
                :url => "http://www.saucelabs.com",
                :timeout_in_second => 90
                )

        @browser.start

        self.prep_folder
    end

    def get_snapshot_for(url)
        @browser.open(url)
        ss = Base64.decode64(@browser.capture_screenshot_to_string)
        File.open(filename(url), 'w') { |f| f.write(ss) }
    end
        
    def get_snapshots_for(urls)
        urls.each { |url| self.get_snapshot(url) }
    end

    def close
        @browser.close
    end

    def filename(url)
        "#{@folder}/#{url.gsub("/","_").gsub(":","_").gsub("?","_")}_#{@browser_name}_#{Time.now.to_f.to_i}.png"
    end

    def prep_folder
        begin
            Dir.mkdir @folder
        rescue
        end
    end
end

def setup_workers(username, access_key, browsers)
    config = {
        :folder => "#{username}_#{Time.now.to_f.to_i}",
        :username => username,
        :access_key => access_key
        }

    browsers.collect do |browser|
        specific_config = config.dup
        specific_config.merge!({:browser => browser})
        $log_file.puts "\tNew worker: #{specific_config.inspect}"
        Snapshotter.new(specific_config)
    end
end

ARGV.each_with_index do |v, c|
  $log_file.puts "#{c}. #{v}"
end

username, access_key = eval(ARGV[0])
browsers = eval(ARGV[1])
urls_file = ARGV[2]
urls     = File.open("#{urls_file}", 'r') { |f| f.read }

$log_file.puts("#{username}  |  #{access_key}  |  #{browsers}  |  #{urls}  |")
$log_file.puts username
$log_file.puts access_key
$log_file.puts browsers
$log_file.puts urls

$log_file.puts "Prepping workers"
workers = setup_workers(username, access_key, browsers)

puts "Snapshotting"
urls.each do |url|
    workers.each do |worker|
        $log_file.puts "\t#{url} [#{worker.browser_name}]"
        worker.get_snapshot_for url
    end
end

workers.each { |worker| worker.close }
$log_file.close
