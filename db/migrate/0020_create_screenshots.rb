class CreateScreenshots < ActiveRecord::Migration
  def self.up
    create_table :screenshots do |t|
      t.references :batch
      t.string :browser_name
      t.string :browser_version
      t.string :url
      t.string :screenshot_path
      t.datetime :time

      t.timestamps
    end
  end

  def self.down
    drop_table :screenshots
  end
end
