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
			ret = icons[self.browser_name+self.browser_version]
		else	
			ret = icons[self.browser_name]
		end
		
	end
end