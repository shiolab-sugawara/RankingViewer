class Webhooks::TwitchController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    event_type = request.headers['Twitch-Eventsub-Message-Type']
    body = JSON.parse(request.body.read)

    if event_type == 'webhook_callback_verification'
      render plain: body['challenge']
    elsif event_type == 'notification'
      handle_event(body)
      head :ok
    else
      head :bad_request
    end
  end

  private

  def handle_event(body)
    event = body['event']
    if body['subscription']['type'] == 'stream.offline'
      broadcaster_id = event['broadcaster_user_id']
      StreamEndProcessor.new(broadcaster_id).process
    end
  end
end

