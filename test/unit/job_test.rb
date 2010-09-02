require 'test_helper'

class JobTest < ActiveSupport::TestCase
  test "jobs are linked to orders" do
    job = Job.new
    job.order_id = 10
    assert job.order_id == 10
  end
end
