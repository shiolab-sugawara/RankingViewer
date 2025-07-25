class CreateStreamSnapshots < ActiveRecord::Migration[7.1]
  def change
    create_table :stream_snapshots do |t|
      t.string :user_name
      t.integer :viewer_count
      t.string :thumbnail_url
      t.datetime :recorded_at

      t.timestamps
    end
  end
end
