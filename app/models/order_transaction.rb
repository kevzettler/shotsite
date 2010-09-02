class OrderTransaction < ActiveRecord::Base
	belongs_to :order
	
	def response=(response)
		self.success = response.success?
		self.authorization = response.authorization
		self.message = response.message
		self.params = response.params
	rescue ActiveMerchant::ActiveMerchantError 
		self.success = false
		self.authorization = nil
		self.message = e.message
		self.params = {}
	end
end
