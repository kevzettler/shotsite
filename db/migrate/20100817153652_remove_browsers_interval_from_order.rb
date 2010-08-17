class RemoveBrowsersIntervalFromOrder < ActiveRecord::Migration
  def self.up
    remove_column :orders, :browsers
    remove_column :orders, :interval
  end

  def self.down
    add_column :orders, :interval, :string
    add_column :orders, :browsers, :string
  end
end
