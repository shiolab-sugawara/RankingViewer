class CreateGameStreamSnapshots < ActiveRecord::Migration[7.1]
  def change
    create_table :game_stream_snapshots, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci" do |t|
      t.string   :game_id
      t.string   :game_name

      t.string   :user_name
      t.integer  :viewer_count
      t.string   :thumbnail_url
      t.datetime :recorded_at
      t.datetime :started_at
      t.json     :tags

      t.timestamps
    end
  end
end