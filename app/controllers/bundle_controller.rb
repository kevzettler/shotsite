class BundleController < ApplicationController  
 
 def build
	puts params
	secretary = Sprockets::Secretary.new(
	  :asset_root   => "public",
	  :load_path    => ["vendor/sprockets/*/src", "vendor/plugins/*/javascripts"],
	  :source_files => ["app/javascripts/application.js", "app/javascripts/**/*.js"]
	)
	
	# Generate a Sprockets::Concatenation object from the source files
	concatenation = secretary.concatenation
	# Write the concatenation to disk
	concatenation.save_to("public/javascripts/cache/#{params[:route_controller]}_#{params[:route_action]}_cache.js")

	# Install provided assets into the asset root
	secretary.install_assets
	
	
 end 
end