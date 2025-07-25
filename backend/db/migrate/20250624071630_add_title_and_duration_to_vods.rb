class AddTitleAndDurationToVods < ActiveRecord::Migration[7.1]
  def change
    add_column :vods, :title, :string
    add_column :vods, :duration, :string
    add_column :vods, :duration_minutes, :integer

    remove_column :vods, :started_at, :datetime
    remove_column :vods, :ended_at, :datetime
  end
end
