class Api::BookmarksController < ApplicationController
  before_action :authenticate_user!

  def create
    twitch_id = params[:twitch_id]

    streamer = Streamer.find_or_initialize_by(twitch_id: twitch_id)

    if streamer.new_record?
      twitch_user = TwitchApiService.fetch_user(twitch_id)

      unless twitch_user
        return render json: { error: "配信者情報を取得できませんでした" }, status: :unprocessable_entity
      end

      streamer.assign_attributes(
        twitch_id: twitch_user["id"],
        user_name: twitch_user["login"],
        display_name: twitch_user["display_name"],
        profile_image_url: twitch_user["profile_image_url"]
      )
      streamer.save!
    end

    current_user.bookmarks.find_or_create_by!(streamer: streamer)

    render json: { message: "ブックマークしました", streamer: streamer }, status: :created
  end
end
