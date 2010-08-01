class CreateScreenshots < ActiveRecord::Migration
  def self.up
    create_table :screenshots do |t|
      t.int :batch_id
      t.int :job_id
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
