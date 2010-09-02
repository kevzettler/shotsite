class CreateJobs < ActiveRecord::Migration
  def self.up
    create_table :jobs do |t|
      t.references :user
      t.references :order
      t.integer :interval
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
