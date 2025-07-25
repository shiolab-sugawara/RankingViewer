class Api::StreamsController < ApplicationController
  def index
    date_str = params[:date]

    unless valid_date?(date_str)
      return render json: { error: 'Invalid or missing date' }, status: :bad_request
    end

    ranking = StreamRankingService.top_streams_by_date(date_str)
    render json: ranking
  end

  private

  def valid_date?(str)
    Date.iso8601(str)
    true
  rescue ArgumentError
    false
  end
end
