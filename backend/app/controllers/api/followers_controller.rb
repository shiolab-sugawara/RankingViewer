class Api::FollowersController < ApplicationController
  def index
    logs = FollowerLog.order(created_at: :asc)
    render json: logs.map { |log| { date: log.created_at.to_date, count: log.follower_count }}
  end
end
