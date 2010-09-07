require 'digest/sha1'

class Screenshot < ActiveRecord::Base
  belongs_to :batch

  def image_location
    "public/screenshots/#{self.folder}/#{Digest::SHA1.hexdigest(url)}_#{@browser_name}-#{@browser_version}.png"
  end

  def folder
    "#{self.batch.job.id}_#{self.batch.od}"
  end

	def pretty_name
		names = {
			"chrome" => "Fire Fox",
			"googlechrome" => "Google Chrome",
			"safari" => "Safari",
			"iexplore" => "Internet Explorer"
		}
		
		ret = names[self.browser_name]
		
		if(self.browser_name == 'iexplore')
			ret = ret +" " + self.browser_version
		end
		
		ret
	end
	
	def icon_image
		icons = {
			"chrome" => "img-firefox.png",
			"safari" => "img-safari.png",
			"googlechrome" => "img-chrome.png",
			"iexplore" => "img-ie8.png",
			"iexplore" => "img-ie7.png", 
			"iexplore" => "img-ie6.png"
		}
	end
end