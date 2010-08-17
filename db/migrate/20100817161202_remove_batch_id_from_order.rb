class RemoveBatchIdFromOrder < ActiveRecord::Migration
  def self.up
    remove_column :orders, :batch_id
  end

  def self.down
    add_column :orders, :batch_id, :int
  end
end
