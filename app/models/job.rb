class Job < ActiveRecord::Base
  belongs_to :user

  attr_accessor :last_run

  def should_be_run?
    Time.now.minutes_in_day - self.last_run > self.interval
  end
end
