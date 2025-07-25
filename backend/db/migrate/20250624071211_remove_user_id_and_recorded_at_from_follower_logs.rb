class RemoveUserIdAndRecordedAtFromFollowerLogs < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :follower_logs, :users rescue nil
    remove_index :follower_logs, :user_id rescue nil
    remove_column :follower_logs, :user_id, :bigint
    remove_column :follower_logs, :recorded_at, :datetime
  end
end
