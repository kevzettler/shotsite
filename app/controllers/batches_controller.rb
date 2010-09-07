class BatchesController < ApplicationController
  def index
    @batches = current_user.batches

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @batches }
    end
  end
end

 
