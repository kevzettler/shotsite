class User < ActiveRecord::Base
  acts_as_authention
  has_many :orders
  has_many :jobs

  validates_presence_of :shots
end
