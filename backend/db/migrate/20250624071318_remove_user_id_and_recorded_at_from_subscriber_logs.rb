class RemoveUserIdAndRecordedAtFromSubscriberLogs < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :subscriber_logs, :users rescue nil
    remove_index :subscriber_logs, :user_id rescue nil
    remove_column :subscriber_logs, :user_id, :bigint
    remove_column :subscriber_logs, :recorded_at, :datetime
  end
end
