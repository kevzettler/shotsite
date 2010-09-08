class ScreenshotsController < ApplicationController
  before_filter :require_user

  # GET /screenshots
  # GET /screenshots.xml
  def index
    @batches = current_user.batches
    @screenshots = current_user.screenshots

    @screenshots = @screenshots.find_all { |s| s.url == params[:url] } if params[:url]

    fields = {
      :only => [:batch_id,
                :url,
                :browser_name,
                :browser_version],
      :methods => [:absolute_url,
                   :taken_at]
    }

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml  => @screenshots.to_xml(fields) }
      format.json { render :json => @screenshots.to_json(fields) }
    end
  end

  # GET /screenshots/1
  # GET /screenshots/1.xml
  def show
    @screenshot = Screenshot.find(params[:id])

    fields = {
      :only => [:url,
                :browser_name,
                :browser_version],
      :methods => [:absolute_url,
                   :taken_at]
    }

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @screenshot.to_xml(fields) }
      format.json { render :json => @screenshot.to_json(fields) }
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
