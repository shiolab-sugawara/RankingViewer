class Api::SubscriberLogsController < ApplicationController
  def index
    logs = SubscriberLog.order(created_at: :asc)
    render json: logs
  end
end
