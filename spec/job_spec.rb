require 'spec_helper'

describe Job do
  before(:each) do
    @user = User.create!({
                           :email => "user@example.com",
                           :password => "suckitbitch",
                           :password_confirmation => "suckitbitch"})
    job_1 = Job.create!({:user_id => @user.id,
                          :interval => 15,
                          :time => Time.now - 20.minutes})
    @job = job_1
  end

  it "should belong to a user" do
    @job.user.should_not be_nil
  end

  it "should have an interval" do
    @job.interval.should_not be_nil
  end

  it "should know if it should be run again" do
    @job.should_be_run?().should eql(true)
  end

  it "should not run if not enough time has passed" do
    @job.last_run = Time.now
    @job.should_be_run?.should be_false
  end
end
