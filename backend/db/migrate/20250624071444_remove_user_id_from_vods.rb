class RemoveUserIdFromVods < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :vods, :users rescue nil
    remove_index :vods, name: "index_vods_on_user_id" rescue nil
    remove_column :vods, :user_id, :bigint
  end
end
