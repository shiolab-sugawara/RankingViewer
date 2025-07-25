class CreateVods < ActiveRecord::Migration[7.1]
  def change
    create_table :vods do |t|
      t.references :user, null: false, foreign_key: true
      t.datetime :started_at
      t.datetime :ended_at
      t.string :game_name

      t.timestamps
    end
  end
end
