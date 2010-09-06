require 'digest/sha1'

class Screenshot < ActiveRecord::Base
  belongs_to :batch

  def image_location
    "public/screenshots/#{self.folder}/#{Digest::SHA1.hexdigest(url)}_#{@browser_name}-#{@browser_version}.png"
  end

  def folder
    "#{self.batch.job.id}_#{self.batch.od}"
  end
end
