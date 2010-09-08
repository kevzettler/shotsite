require 'digest/sha1'

class Screenshot < ActiveRecord::Base
  # Don't include class as root node in json
  self.include_root_in_json = false
  
  belongs_to :batch

  # Returns ":created_at" in seconds since epoch
  def taken_at
    created_at.to_f.to_i
  end

  def absolute_url
    "http://localhost:3000/#{screenshot_path}"
  end

  def image_location
    "public/screenshots/#{self.folder}/#{Digest::SHA1.hexdigest(url)}_#{@browser_name}-#{@browser_version}.png"
  end

  def folder
    "#{self.batch.job.id}_#{self.batch.id}"
  end

  def pretty_name
    names = {
      "chrome" => "FireFox",
      "googlechrome" => "Google Chrome",
      "safari" => "Safari",
      "iexplore" => "Internet Explorer"
    }
    
    return "#{names[browser_name]} #{browser_version}" if browser_name == 'iexplore'

    return names[browser_name]
  end

  # TODO: This should be moved into view layer
  def icon
    icons = {
      "chrome" => "img-firefox.png",
      "safari" => "img-safari.png",
      "googlechrome" => "img-chrome.png",
      "iexplore8" => "img-ie8.png",
      "iexplore7" => "img-ie7.png", 
      "iexplore6" => "img-ie6.png"
    }
    
    if(self.browser_name == 'iexplore')
      ret = icons[self.browser_name + self.browser_version]
    else	
      ret = icons[self.browser_name]
    end
    
  end
end
