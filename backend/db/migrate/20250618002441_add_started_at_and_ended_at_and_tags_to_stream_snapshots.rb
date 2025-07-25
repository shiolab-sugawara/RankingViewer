class AddStartedAtAndEndedAtAndTagsToStreamSnapshots < ActiveRecord::Migration[7.1]
  def change
    add_column :stream_snapshots, :started_at, :datetime
    add_column :stream_snapshots, :tags, :json
  end
end
