class AddBatchIntervalToJob < ActiveRecord::Migration
  def self.up
    add_column :jobs, :batch, :string
    add_column :jobs, :interval, :int
  end

  def self.down
    remove_column :jobs, :interval
    remove_column :jobs, :batch
  end
end
