class AddShotsToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :shots, :int
  end

  def self.down
    remove_column :users, :shots
  end
end
