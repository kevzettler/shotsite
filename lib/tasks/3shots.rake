desc "List all pending 3shots jobs"
task :list_pending => :environment do
  Job.pending.each do |job|
    puts job.info
  end
end

desc "Run a specific job"
task :run_job => :environment do
  require '3shot_client.rb'
end
