class Job < ActiveRecord::Base
  belongs_to :user

  has_many :batches

  named_scope :pending, lambda {{:conditions => ["next_run < ?", Time.now]}}

  attr_accessor :last_run
  validates_presence_of :user

  def initialize(attributes = nil)
    super
    self.next_run ||= (Time.now + self.interval.minutes)
  end

  def shots_per_run
    JSON.parse(self.browsers).count * JSON.parse(self.urls).count
  end

  def enough_credit?
    user.shots > self.shots_per_run
  end

  def run
    puts "running job##{self.id}"
    return false unless enough_credit?

    new_batch = Batch.new({:job_id => self.id})
    new_batch.save

    self.last_run = Time.now
    self.next_run = (Time.now + self.interval.minutes)
    save

    new_batch.run
  end
end
