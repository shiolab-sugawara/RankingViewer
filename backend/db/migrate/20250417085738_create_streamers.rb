class CreateStreamers < ActiveRecord::Migration[7.1]
  def change
    create_table :streamers do |t|
      t.string :twitch_id
      t.string :user_name
      t.string :display_name
      t.string :profile_image_url

      t.timestamps
    end
  end
end
