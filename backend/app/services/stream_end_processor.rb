class StreamEndProcessor
  def initialize(user_id)
    @api = TwitchAPIService.new
  end

  def process

    vod = @api.fetch_latest_vod(ENV["ANALYZE_STREAMER"])
    return unless vod

    @streamer.vods.create!(
      title: vod[:title],
      duration: vod[:duration],
      duration_minutes: parse_duration(vod[:duration]),
      created_at: vod[:created_at]
    )
  end

  def parse_duration(duration)
    h = duration[/(\d+)h/, 1].to_i
    m = duration[/(\d+)m/, 1].to_i
    s = duration[/(\d+)s/, 1].to_i
    (h * 60) + m + (s / 60)
  end
end
