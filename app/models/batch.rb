class Batch < ActiveRecord::Base
  belongs_to :job
  has_many :screenshots

  def initialize(options = nil)
    super
    self.status = options[:status] || "aroused"
  end
  
  def groups
    groups = screenshots.collect{|s| {:url => s.url, :screenshots => []}}.uniq
    groups.each do |g| 
      g[:screenshots] = screenshots.find_all_by_url(g[:url])
    end
  end

  # TODO: Make sure this stays in sync with the 3shots_client.rb method
  def screenshots_dir
    "screenshots/#{self.job_id}_#{self.id}"
  end

  def run
    system "rake run_job BATCH_ID=#{self.id} --trace &"
  end
end
