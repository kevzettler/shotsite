class CreateJobs < ActiveRecord::Migration
  def self.up
    create_table :jobs do |t|
      t.references :user
      t.integer :interval
      t.string :browsers
      t.string :urls
      t.string :status

      t.datetime :last_run
      t.datetime :next_run
      t.timestamps
    end
  end

  def self.down
    drop_table :jobs
  end
end
