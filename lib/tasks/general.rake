desc "Load hand-coded ruby-based fixtures"
task :new_fixtures => :environment do
  u = User.new(:email => "sean@fakecoolguys.com",
               :password => "aabbccddee")
  u.save(false)
  u2 = u.clone
  u2.email = "kev@fakecoolguys.com"
  u2.save(false)

  j = Job.new(:user => u,
              :interval => 15,
              :browsers => [{ :name => "firefox",
                             :version => "3."}].to_json,
              :urls => ["http://www.google.com",
                        "http://fakecoolguys.com"].to_json,
              :last_run => 30.minutes.ago,
              :next_run => Time.now + 5.minutes)
  j.save(false)

  j2 = j.clone
  j2.user = u2
  j2.interval = 60
  j2.urls = ["http://callmekev.com/",
             "http://saucelabs.com/"].to_json
  j2.save(false)

  o = Order.new(:user => u,
                :cents_per_shot => 2,
                :shots => 500,

                :first_name => "Sean",
                :last_name => "Grove",
                :address1 => "523 Walker Dr. Apt. #16",
                :city => "Mountian View",
                :state => "CA",
                :zip => "94043",

                :card_type => "master",
                :card_expires_on => Time.now + 3.years,
                :ip_address => "127.0.0.1")

  o.save(false)
  
  o = Order.new(:user => u2,
                :cents_per_shot => 2,
                :shots => 500,

                :card_type => "master",
                :card_expires_on => Time.now + 3.years,
                :ip_address => "127.0.0.1",

                :first_name => "Kevin",
                :last_name => "Zettler",
                :address1 => "523 Walker Dr. Apt. #18",
                :city => "Mountian View",
                :state => "CA",
                :zip => "94043")

  o.save(false)
                
end

desc "Drop the db, re-run migrations, and load fixtures"
task :reload_db => ["db:drop", "db:migrate", :new_fixtures]
