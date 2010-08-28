class OrdersController < ApplicationController
	# GET /screenshots
  # GET /screenshots.xml
  def index
		if current_user
	    @orders = current_user.orders
			print "lol user\n" 
			print current_user.orders

	    respond_to do |format|
	      format.html # index.html.erb
	      format.xml  { render :xml => @orders }
	    end
		else
			redirect_to root_url
		end
  end
	
	def new
			@order = Order.new(:express_token => params[:token])
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
		response = EXPRESS_GATEWAY.setup_purchase(99.88,
			:ip => request.remote_ip,
			:return_url => new_order_url,
			:cancel_return_url => root_url
		)
		redirect_to EXPRESS_GATEWAY.redirect_url_for(response.token)
	end
	
end
