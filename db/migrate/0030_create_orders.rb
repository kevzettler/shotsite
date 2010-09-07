class CreateOrders < ActiveRecord::Migration
  def self.up
    create_table :orders do |t|
      t.references :user
      t.integer    :cents_per_shot 
      t.integer    :shots
      
      t.string :card_type
      t.date   :card_expires_on
      t.string :ip_address

      # Billing address
      t.string :first_name
      t.string :last_name
      t.string :address1
      t.string :city
      t.string :state
      t.string :country
      t.string :zip

      t.string :express_token
      t.string :express_payer_id

      t.timestamps
    end
  end

  def self.down
    drop_table :orders
  end
end
