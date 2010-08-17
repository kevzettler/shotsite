class AddPriceShotsUserToOrder < ActiveRecord::Migration
  def self.up
    add_column :orders, :price, :float
    add_column :orders, :shots, :int
  end

  def self.down
    remove_column :orders, :shots
    remove_column :orders, :price
  end
end
