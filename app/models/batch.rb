class Batch < ActiveRecord::Base
  belongs_to :job

  def initialize(options = nil)
    super
    self.status = options[:status] || "aroused"
  end

  # TODO: Make sure this stays in sync with the 3shots_client.rb method
  def screenshots_dir
    "screenshots/#{self.job_id}_#{self.id}"
  end

  def run
    system "rake run_job BATCH_ID=#{self.id} --trace &"
  end
end
