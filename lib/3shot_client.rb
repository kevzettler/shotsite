$log_file = "log/3shot_client_log.txt"

require 'base64'
require 'rubygems'
require 'json'
require 'selenium/client'
require 'digest/sha1'
require 'yaml'
require 'parallel'
require 'snapshotter.rb'

$batch_id = ENV['BATCH_ID']

$log = File.open($log_file, "a+")
$log.puts "Logging for Snapshotter batch: #{$batch_id}"

$log.puts "ERROR: BATCH_ID was not specified in the environmental variable" unless $batch_id

def setup_workers(username, access_key, job, batch, urls)
  config = {
    :folder => "#{job.id}_#{batch.id}",
    :username => username,
    :access_key => access_key,
    :urls => urls
  }
  
  JSON.parse(job.browsers).collect do |browser|
    specific_config = config.dup
    specific_config.merge!({:browser => browser["name"], :browser_version => browser["version"]})
    $log.puts "\tNew worker: #{specific_config.inspect}"
    Snapshotter.new(specific_config)
  end
end

ARGV.each_with_index do |v, c|
  $log.puts "#{c}. #{v}"
end

account_info = YAML.load_file("#{RAILS_ROOT}/lib/ondemand.yml")
username = account_info[:username]
access_key = account_info[:api_key]

batch = Batch.find $batch_id
job = Job.find batch.job_id
urls = JSON.parse job.urls
time = job.last_run

batch.status = "Loading"
batch.save

$log.puts("#{username}  |  #{access_key}  |  #{job.browsers}  |  #{urls} ")

$log.puts "Prepping workers"
workers = setup_workers(username, access_key, job, batch, urls)

batch.status = "Snapshotting"
batch.save

$log.puts "Snapshotting"
Parallel.map(workers, :in_processes => workers.count) do |worker|
  worker.run
  worker.close
end

batch.status = "Finished"
batch.save
$log.close
