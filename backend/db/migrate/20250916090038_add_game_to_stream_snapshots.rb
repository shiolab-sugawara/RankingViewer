class AddGameToStreamSnapshots < ActiveRecord::Migration[7.1]
  def change
    add_column :stream_snapshots, :game_id, :string
    add_column :stream_snapshots, :game_name, :string
  end
end
