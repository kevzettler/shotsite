class CreateOrders < ActiveRecord::Migration
  def self.up
    create_table :orders do |t|
      t.int :user_id
      t.string :browsers
      t.string :interval

      t.timestamps
    end
  end

  def self.down
    drop_table :orders
  end
end
