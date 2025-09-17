class StreamRankingService
  LIMIT = 20

  def self.top_streams_by_date(date_str, limit: LIMIT)
    return [] unless date_str.present?
    target_date = Date.parse(date_str)

    scope =
      if target_date == Date.current
        StreamSnapshot.where(recorded_at: target_date.all_day)
      else
        StreamHistory.where(recorded_at: target_date.all_day)
      end

    streams = scope.order(viewer_count: :desc).limit(limit)
    normalize_from_models(streams)
  end

  def self.top_streams_by_game(game_id, limit: LIMIT)
    return [] unless game_id.present?

    client = TwitchApiService.new

    streams = client.fetch_streams_by_game(game_id: game_id)
    normalize_from_twitch(streams)
  end

  private

  def self.normalize_from_models(records)
    records.map do |s|
      {
        user:      s.user_name,
        viewers:   s.viewer_count,
        thumbnail: s.thumbnail_url,
        duration:  format_duration(s.started_at, s.recorded_at),
        tags:      (s.respond_to?(:tags) ? (s.tags || []) : []),
        game_id:   s.game_id,
        game_name: s.game_name
      }
    end
  end

  def self.normalize_from_twitch(streams)
    Array(streams).map do |s|
      {
        user:      s[:user_login]   || s[:user_name] || "",
        viewers:   s[:viewer_count] || 0,
        thumbnail: s[:thumbnail_url] || "",
        duration:  nil,
        tags:      (s[:tags].is_a?(Array) ? s[:tags] : []),
        game_id:   s[:game_id],
        game_name: s[:game_name],
      }
    end
  end

  def self.format_duration(start_time, end_time)
    return nil unless start_time && end_time
    seconds = (end_time - start_time).to_i
    return nil if seconds <= 0
    Time.at(seconds).utc.strftime("%H:%M:%S")
  end
end
