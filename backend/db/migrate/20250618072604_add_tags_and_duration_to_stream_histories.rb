class AddTagsAndDurationToStreamHistories < ActiveRecord::Migration[7.1]
  def change
    add_column :stream_histories, :tags, :json
    add_column :stream_histories, :started_at, :datetime
  end
end
