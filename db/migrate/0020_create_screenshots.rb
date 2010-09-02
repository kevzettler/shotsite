class CreateScreenshots < ActiveRecord::Migration
  def self.up
    create_table :screenshots do |t|
      t.references :batch
      t.references :job
      t.string :browser
      t.string :url
      t.datetime :time

      t.timestamps
    end
  end

  def self.down
    drop_table :screenshots
  end
end
