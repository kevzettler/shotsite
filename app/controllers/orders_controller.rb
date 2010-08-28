class OrdersController < ApplicationController
	def new
			@order = Order.new
	end
	
	def create
			@order = Order.new
			@order.ip_address = request.remote_ip
			if @order.save
				if @order.purchase
					render :action => "success"
				else
					render :action => "failure"
				end
			else
				render :action => 'new'
			end
	end
	
	def express
		response = EXPRESS_GATEWAY.setup_purchase(current_cart.build_order.price_in_cents,
			:ip => request.remote_ip,
			:return_url => new_order_url,
			:cancel_return_url => products_url
		)
		redirect_to EXPRESS_GATEWAY.redirect_url_for(response.token)
	end
	
end
