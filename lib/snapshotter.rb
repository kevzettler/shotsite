class Snapshotter
  attr_reader :browser_name
  attr_reader :urls

  def initialize(options={})
    salt = ""
    50.times { salt += rand(100).to_s }

    @uuid = Digest::SHA1.hexdigest("#{Time.now}#{salt}")
    @username = options[:username]
    @access_key = options[:access_key]
    @browser_name = options[:browser]
    @browser_version = options[:browser_version]
    @folder  = options[:folder]
    @urls = options[:urls]
    @log_file = options[:log_file] || $log_file
    @log = File.open(@log_file, "a+")
    @log.puts "Snapshotter [#{@uuid}] batch: #{$batch_id}"
    
    self.prep_folder
  end
  
  def start
    log "Starting a new browser"
    @browser = Selenium::Client::Driver.new(
                                            :host => "saucelabs.com",
                                            :port => 4444,
                                            :browser =>
                                            {
                                              "username" => @username,
                                              "access-key" => @access_key,
                                              "os" => "Windows 2003",
                                              "browser" => @browser_name,
                                              "browser-version" => @browser_version,
                                              "job-name" => "3shots alpha [#{@browser_name}]"
                                            }.to_json,           
                                            :url => "http://www.saucelabs.com",
                                            :timeout_in_second => 90
                                            )

    @browser.start
    log "Finished starting a new browser"
  end

  def log(message)
    @log.puts "Snapshotter [#{@uuid}]: #{message}"
  end

  def get_snapshot_for(url)
    begin
      url = "http://" + url if "http" != url[0..3]
      
      self.log "Opening page [#{url}] and waiting for page load"
      @browser.open(url)
      @browser.wait_for_page_to_load
      self.log "Requesting base64 encoded screenshot"
      ss = Base64.decode64(@browser.capture_screenshot_to_string)
      File.open(filename(url, true), 'w') { |f| f.write(ss) }
      self.log "Creating new screenshot model"
      ss = Screenshot.new
      ss.url = url
      ss.browser_name = @browser_name
      ss.browser_version = @browser_version
      self.log "Creating screenshot.path"
      ss.screenshot_path = filename(url)
      self.log "Saving screenshots to: #{ss.screenshot_path}"
      ss.batch_id = $batch_id
      ss.save
    rescue
      self.log "Error snapshotting browser: #{@browser_name} url: #{url}"
      self.log "\tError: #{$ERROR_INFO}"
    end
  end
  
  def get_snapshots_for(urls)
    urls.each { |url| self.log "\t#{url} [#{@browser_name}]"; self.get_snapshot(url) }
  end

  def close
    log "Closing down browser"
    @browser.close_current_browser_session
    @browser.shut_down_selenium_server
  end

  def filename(url, filepath = false)
    path = ""
    path += "public/" if filepath
    path += "screenshots/#{@folder}/#{Digest::SHA1.hexdigest(url)}_#{@browser_name}-#{@browser_version}.png".gsub!(/\.\.*/, '.')
    path
  end

  def prep_folder
    begin
      self.log "Making folder: public/screenshots/#{@folder}"
      Dir.mkdir "public/screenshots/#{@folder}"
    rescue
      self.log "ERROR Making folder"
    end
  end

  def run
    self.start

    @urls.each do |url|
      self.get_snapshot_for url
    end

    self.close
  end
end
