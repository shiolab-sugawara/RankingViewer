class StreamRankingService
  def self.top_streams_by_date(date_str)
    target_date = Date.parse(date_str)

    streams =
    if target_date == Date.current
      snapshots = StreamSnapshot.where(recorded_at: target_date.all_day)
    else
      StreamHistory
        .where(recorded_at: target_date.all_day)
        .order(viewer_count: :desc)
        .limit(20)
    end

    streams.map do |s|
        {
          user: s.user_name,
          viewers: s.viewer_count,
          thumbnail: s.thumbnail_url,
          duration: format_duration(s),
          tags: s.tags || []
        }
    end
  end

  def self.format_duration(stream)
    start_time = stream.started_at
    end_time = stream.recorded_at
    return nil unless start_time && end_time

    seconds = end_time - start_time
    Time.at(seconds).utc.strftime("%H:%M:%S")
  end
end
