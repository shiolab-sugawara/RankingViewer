require "httparty"

class TwitchApiService
  include HTTParty
  base_uri "https://api.twitch.tv/helix"
  headers "Client-ID" => ENV["TWITCH_CLIENT_ID"],
          "Authorization" => "Bearer #{ENV['TWITCH_ACCESS_TOKEN']}"

  def fetch_top_streams_with_streamer
    query = {
      language: "ja",
      first: "20"
    }

    response = self.class.get("/streams", query: query).parsed_response
    streams = response["data"]

    {
      streams: streams.map do |stream|
        {
          user: stream["user_name"],
          viewers: stream["viewer_count"],
          thumbnail: stream["thumbnail_url"].gsub("{width}", "320").gsub("{height}", "180"),
          started_at: stream["started_at"],
          tags: stream["tags"],
          game_id: stream["game_id"],
          game_name: stream["game_name"]
        }
      end
    }
  end

  def fetch_streams_by_game(game_id:, limit: 20, language: "ja")
    q = { game_id:, first: limit }
    q[:language] = language if language

    response = self.class.get("/streams", query: q).parsed_response
    raw_streams = response["data"]

    streams = raw_streams.map do |stream|
      {
        user:        stream["user_name"],
        viewers:     stream["viewer_count"],
        thumbnail:   stream["thumbnail_url"].gsub("{width}", "320").gsub("{height}", "180"),
        started_at:  stream["started_at"],
        tags:        stream["tags"],
        game_id:     stream["game_id"],
        game_name:   stream["game_name"]
      }
    end

    GameStreamSnapshot.delete_all

    streams.each do |s|
      ::GameStreamSnapshot.create!(
        user_name:     s[:user],
        viewer_count:  s[:viewers],
        thumbnail_url: s[:thumbnail],
        recorded_at:   Time.current,
        started_at:    s[:started_at],
        tags:          s[:tags],
        game_id:       s[:game_id],
        game_name:     s[:game_name]
      )
    end

    { streams: streams }
  end

  def register_eventsub(user_id)
    body = {
      type: "stream.offline",
      version: "1",
      condition: {
        broadcaster_user_id: user_id
      },
      transport: {
        method: "webhook",
        callback: ENV["TWITCH_CALLBACK_URL"],
        secret: ENV["TWITCH_WEBHOOK_SECRET"]
      }
    }

    self.class.post("/eventsub/subscriptions", body: body.to_json)
  end


  def fetch_streamer
    response = self.class.get("/users", query: { id: twitch_id })
    response.parsed_response["data"]&.first
  end

  def fetch_follower_count(user_id)
    response = self.class.get("/channels/followers", query: { broadcaster_id: user_id })
    response.parsed_response["total"].to_i
  end

  def fetch_latest_vod(user_id)
    response = self.class.get("/videos?user_id=#{user_id}&first=1&type=archive")
    video = response.parsed_response["data"]&.first
    return nil unless video

    {
      title: video["title"],
      duration: video["duration"],
      created_at: video["created_at"]
    }
  end
end
