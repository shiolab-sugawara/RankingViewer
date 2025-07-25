class CreateSubscriberLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :subscriber_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :subscriber_count
      t.datetime :recorded_at

      t.timestamps
    end
  end
end
