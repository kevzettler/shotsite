class BundleController < ApplicationController  
  def build
    if "development" == ENV["RAILS_ENV"]
      controller = params[:js_controller]
      action = params[:js_action]
      
      secretary = Sprockets::Secretary.new(:root => ".",
                                           :asset_root => "public",
                                           :load_path    => ["public/javascripts/pages", "public/javascripts/"],
                                           :source_files => ["public/javascripts/pages/#{controller}_#{action}.js"])
      
      # Generate a Sprockets::Concatenation object from the source files
      concatenation = secretary.concatenation

      respond_to do |format|
        format.js { render :js => concatenation.to_s }
      end
    end
  end 
end
