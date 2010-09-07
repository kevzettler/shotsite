class User < ActiveRecord::Base
  acts_as_authentic
  has_many :orders
  has_many :jobs

  validates_presence_of :shots
	
	
	def screenshots
		jobs.collect { |j| j.screenshots }.flatten
	end
	
	def batches
		jobs.collect { |b| b.batches }.flatten
	end
end
