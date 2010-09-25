module JobsHelper
	
	def urls_block(job, urls)
		html_output = "<textarea id=\"#{job.id}_urls\" name=\"#{job.id}_urls\"  row=\"4\">"
		urls.each do |u|
		 html_output += u + "\n" 
		end	
		html_output += "</textarea>"
	end
	
	def pretty_name(browser)
    names = {
      "chrome" => "FireFox",
      "googlechrome" => "Google Chrome",
      "safari" => "Safari",
      "iexplore" => "Internet Explorer"
    }
    
    return "#{names[browser['name']]} #{browser['version']}" if browser['name'] == 'iexplore'

    return names[browser["name"]]
  end

  # TODO: This should be moved into view layer
  def icon(browser)
    icons = {
      "chrome" => "img-firefox.png",
      "safari" => "img-safari.png",
      "googlechrome" => "img-chrome.png",
      "iexplore8" => "img-ie8.png",
      "iexplore7" => "img-ie7.png", 
      "iexplore6" => "img-ie6.png"
    }
    
    if(browser["name"] == 'iexplore')
      ret = icons[browser["name"] + browser["version"]]
    else	
      ret = icons[browser["name"]]
    end
  end
	
	def browser_tag(job, job_browsers, browser)
		html_string = "<input type=\"checkbox\" name=\"#{pretty_name browser}_check\" value=\"chrome:3\" id=\"#{job.id}_#{pretty_name browser}_check\"";
		
		if job_browsers.include? browser
		   html_string += "checked=\"true\""
		end
		 
		html_string += "/><label for=\"#{job.id}_#{pretty_name browser}_check\" class=\"#{pretty_name browser}_check\">" + image_tag(icon(browser), :alt => pretty_name(browser), :size => "30x30") + "</label>"
	end
	
	def browser_block(job, job_browsers)
	#current list of @browsers  
	#TODO: put this shit in a model or some class so its more flexible and not hard coded everywhere
	browsers = [
		{
		"name" => "chrome",
		"version" => '3'
		},
		{
		"name" => "safari",
		"version" => "4"
		},
		{
		"name" => "googlechrome",
		"version" => ""
		},
		{
		"name" => "iexplore",
		"version" => "6"
		},
		{
		"name" => "iexplore",
		"version" => "7"
		},
		{
		"name" => "iexplore",
		"version" => "8"
		},
	]	  
	 
	 
	 output = '<div class="browser_buttons">'

	 browsers.each do |browser|
		 output += browser_tag job, job_browsers, browser
	 end 
	
	 output += '</div>'
	 output
	end
end
