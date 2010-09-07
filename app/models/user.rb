class User < ActiveRecord::Base
  acts_as_authentic

  has_many :orders
  has_many :jobs
  has_many :batches, :through => :jobs

  validates_presence_of :shots
  
  def screenshots
    batches.collect { |j| j.screenshots }.flatten
  end
end
