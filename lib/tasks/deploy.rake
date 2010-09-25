require 'sprockets'

desc "Generate all javascript files"
task :bundle_js do
  routes = {:jobs => [:index,
                      :new,
                      :show,
                      :edit]}

  routes.each_pair do |controller, actions|
    actions.each do |action|
      puts "Attempting to sprocketize \"public/javascripts/pages/#{controller}_#{action}.js\""

      begin
        secretary = Sprockets::Secretary.new(:root => ".",
                                             :asset_root => "public",
                                             :load_path    => ["public/javascripts/pages", "public/javascripts/"],
                                             :source_files => ["public/javascripts/pages/#{controller}_#{action}.js"])

        # Generate a Sprockets::Concatenation object from the source files
        concatenation = secretary.concatenation

        # Write the uncompiled concatenated temp javascript file to disk
        concatenation.save_to("public/javascripts/cache/#{controller}_#{action}_temp.js")

        # Compile that bitch
        system("java -jar lib/closure/compiler.jar --js public/javascripts/cache/#{controller}_#{action}_temp.js --js_output_file public/javascripts/cache/#{controller}_#{action}_cache.js")

        # Remove the uncompiled version
        File.delete("public/javascripts/cache/#{controller}_#{action}_temp.js")
        
        # Install provided assets into the asset root
        secretary.install_assets

      rescue Exception => e
        puts "Error loading file. Does \"public/javascripts/pages/#{controller}_#{action}.js\" exist?"
        puts "$!: #{$!}"
        puts "#{ e } (#{e.class})"
      end
    end
  end
end
