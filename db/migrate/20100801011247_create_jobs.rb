class CreateJobs < ActiveRecord::Migration
  def self.up
    create_table :jobs do |t|
      t.int :user_id
      t.int :order_id
      t.string :browsers
      t.string :urls
      t.datetime :time

      t.timestamps
    end
  end

  def self.down
    drop_table :jobs
  end
end
