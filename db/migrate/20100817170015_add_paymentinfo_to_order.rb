class AddPaymentinfoToOrder < ActiveRecord::Migration
  def self.up
    add_column :orders, :first_name, :string
    add_column :orders, :last_name, :string
    add_column :orders, :card_type, :string
    add_column :orders, :card_expires_on, :date
    add_column :orders, :ip_address, :string
  end

  def self.down
    remove_column :orders, :ip_address
    remove_column :orders, :card_expires_on
    remove_column :orders, :card_type
    remove_column :orders, :last_name
    remove_column :orders, :first_name
  end
end
