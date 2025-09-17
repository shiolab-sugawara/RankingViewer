# app/controllers/api/streams_controller.rb
class Api::StreamsController < ApplicationController
  def index
    game_id  = params[:game_id].presence
    date_str = params[:date].presence

    if game_id.present?
      ranking = StreamRankingService.top_streams_by_game(game_id)
      return render json: ranking, status: :ok
    end

    unless valid_date?(date_str)
      return render json: { error: "Invalid or missing date" }, status: :bad_request
    end

    ranking = StreamRankingService.top_streams_by_date(date_str)
    render json: ranking, status: :ok

  rescue => e
    Rails.logger.error(<<~LOG)
      [Api::Streams#index] #{e.class}: #{e.message}
      #{e.backtrace&.first(5)&.join("\n")}
    LOG
    render json: { error: "internal_server_error" }, status: :internal_server_error
  end

  private

  def valid_date?(str)
    Date.iso8601(str)
    true
  rescue ArgumentError, TypeError
    false
  end
end
