class User < ActiveRecord::Base
		acts_as_authentic
		has_many :orders
		has_many :jobs
end
