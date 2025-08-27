class FollowerFetcher
  def initialize
    @api = TwitchApiService.new
  end

  def fetch_and_log
    count = @api.fetch_follower_count(ENV["ANALYZE_STREAMER_ID"])
    FollowerLog.create!(
      follower_count: count
    )
  end
end