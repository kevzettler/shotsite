class JobsController < ApplicationController
  before_filter :require_user

  # GET /jobs
  # GET /jobs.xml
  def index
    @jobs = Job.find(:all, :conditions => {:user_id => current_user.id}, :order => "created_at DESC")

    respond_to do |format|
      format.html # index.html.erb
      format.xml   { render :xml => @jobs }
      format.json  { render :json => @jobs.to_json(:include => { :batches => {
                                                       :include => { :screenshots => {
                                                           :only => [
                                                                     :batch_id,
                                                                     :url,
                                                                     :browser_name,
                                                                     :browser_version
                                                                    ],
                                                           :methods => [
                                                                        :absolute_url,
                                                                        :taken_at
                                                                       ]
                                                         }}}})}
    end
  end

  # GET /jobs/1
  # GET /jobs/1.xml
  def show
    @job = Job.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @job }
    end
  end

  # GET /jobs/new
  # GET /jobs/new.xml
  def new
    @job = Job.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @job }
    end
  end

  # GET /jobs/1/edit
  def edit
    @job = Job.find(params[:id])
  end

  # POST /jobs
  # POST /jobs.xml
  def create
    job_info = params[:job]
    user_id = current_user.id
    job_info[:user_id] = user_id

    @job = Job.new(job_info)

    respond_to do |format|
      if @job.save
        format.html { redirect_to(@job, :notice => 'Job was successfully created.') }
        format.xml  { render :xml => @job, :status => :created, :location => @job }
        format.json { render :json => @job, :status => :created, :location => @job}
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @job.errors, :status => :unprocessable_entity }
        format.json {render :json => @job.errors, :status => :unprocessable_entity}
      end
    end
  end

  # PUT /jobs/1
  # PUT /jobs/1.xml
  def update
    @job = Job.find(params[:id])

    respond_to do |format|
      if @job.update_attributes(params[:job])
        format.html { redirect_to(@job, :notice => 'Job was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @job.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /jobs/1
  # DELETE /jobs/1.xml
  def destroy
    @job = Job.find(params[:id])
    @job.destroy

    respond_to do |format|
      format.html { redirect_to(jobs_url) }
      format.xml  { head :ok }
    end
  end

  protected

  def require_user
    unless current_user
      flash[:notice] = "You must be logged in to do that"
      respond_to do |format|
        format.html { redirect_to login_url }
        format.xml  { render :xml =>  {:error => "Please authenticate using your REST credentials" }  and return }
        format.json { render :json => {:error => "Please authenticate using your REST credentials" }  and return }
      end
    end
  end
end
