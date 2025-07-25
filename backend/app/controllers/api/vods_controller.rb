class Api::VodsController < ApplicationController
  def index
    vods = Vod.order(created_at: :asc)
    render json: vods
  end
end
