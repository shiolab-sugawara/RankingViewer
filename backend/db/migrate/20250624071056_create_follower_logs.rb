class CreateFollowerLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :follower_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :follower_count
      t.datetime :recorded_at

      t.timestamps
    end
  end
end
