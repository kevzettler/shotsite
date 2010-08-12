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
				format.json {render :json => {:sucess => false}, status=> :failed}
			end
		end
	end
	
	def destroy
		@user_session = UserSession.find(params[:id])
		@user_session.destroy
		flash[:notice] = "Successfully logged out."
		redirect_to root_url		
	end
end
