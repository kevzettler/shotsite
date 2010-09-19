class OrdersController < ApplicationController
	# GET /screenshots
  # GET /screenshots.xml
  def index
		if current_user
	    @orders = current_user.orders

	    respond_to do |format|
	      format.html # index.html.erb
	      format.xml  { render :xml => @orders }
	    end
		else
			redirect_to root_url
		end
  end
	
	def new
			@order = Order.new({:express_token => params[:token]})
	end
	
	def create
			doodbro = params[:order]
			puts doodbro[:price].to_i
			doodbro[:price] = doodbro[:price].to_i
			doodbro[:card_expires_on] = Date.civil(params[:order][:card_expires_on][:year].to_i, params[:order][:card_expires_on][:month].to_i) 
			@order = Order.new(doodbro)
			@order.user_id = current_user.id
			@order.ip_address = request.remote_ip
			respond_to do |format|
				if @order.save
					if @order.purchase
						format.json {render :json => @order, :status => :created}
					else
						format.json {render :json=> @order.errors, :status => :unprocessable_entity}
					end
				else
					format.json {render :json=> @order.errors, :status => :unprocessable_entity}
				end 
			end
	end
	
	def express
		response = EXPRESS_GATEWAY.setup_purchase(0.99,
			:ip => request.remote_ip,
			:return_url => new_order_url,
			:cancel_return_url => root_url
		)
		redirect_to EXPRESS_GATEWAY.redirect_url_for(response.token)
	end
	
end
