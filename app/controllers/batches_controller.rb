class BatchesController < ApplicationController
	def index
	  @jobs = current_user.jobs

	  respond_to do |format|
	    format.html # index.html.erb
	    format.xml  { render :xml => @jobs }
	  end
	end
end

 
