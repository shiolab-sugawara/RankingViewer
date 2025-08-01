class FollowerFetcher
  def initialize
    @api = TwitchAPIService.new
  end

  def fetch_and_log
    count = @api.fetch_follower_count(ENV["ANALYZE_STREAMER"])
    Followerlogs.create!(
      follower_count: count
    )
  end
end