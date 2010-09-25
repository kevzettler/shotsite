class UserSessionsController < ApplicationController
	def new
		@user_session = UserSession.new
	end
	
	def create
		@user_session = UserSession.new(params[:user_session])
		respond_to do |format|
			if @user_session.save
				flash[:notice] = "Successfully created user session."
				format.html {redirect_to root_url}
				format.json {render :json => @user_session, :status=> :created, :location => @user}
			else
				format.html {render :action => 'new'}
				format.json {render :json => @user_session.errors, :status => :unprocessable_entity}
			end
		end
	end
	
	def destroy
		@user_session = UserSession.find(params[:id])
		respond_to do |format|
			if @user_session.nil? or @user_session.destroy
				flash[:notice] = "Successfully logged out."
				format.html{ redirect_to root_url}
				format.json {render :json => @user_session}
			else
				format.html {redirect_to root_url}
				format.json {render :json => @user_session, :status => :unprocessable_entity}
			end
		end
	end
end
