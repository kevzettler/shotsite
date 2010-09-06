class CreateOrders < ActiveRecord::Migration
  def self.up
    create_table :orders do |t|
      t.references :user
      t.integer    :cents_per_shot 
      t.integer    :shots
      
      t.string :first_name
      t.string :last_name
      t.string :card_type
      t.date   :card_expires_on
      t.string :ip_address

      t.string :express_token
      t.string :express_payer_id

      t.timestamps
    end
  end

  def self.down
    drop_table :orders
  end
end
