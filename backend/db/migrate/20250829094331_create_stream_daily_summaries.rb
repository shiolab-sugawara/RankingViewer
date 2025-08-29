class CreateStreamDailySummaries < ActiveRecord::Migration[7.1]
  def change
    create_table :stream_daily_summaries do |t|
      t.string :user_name
      t.integer :viewer_count
      t.string :thumbnail_url
      t.datetime :recorded_at
      t.datetime :started_at
      t.json :tags

      t.timestamps
    end
  end
end
