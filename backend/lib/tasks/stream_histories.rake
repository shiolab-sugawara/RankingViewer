namespace :stream_histories do
  desc "StreamHisoryモデルから上位20名のデータを持ってくる"
  task save: :environment do
    target_date = Date.today

    top_streams = StreamSnapshot
      .where(recorded_at: target_date.all_day)
      .select("user_name, thumbnail_url, MAX(viewer_count) AS viewer_count")
      .group(:user_name, :thumbnail_url)
      .order("viewer_count DESC")
      .limit(20)

    top_streams.each do |stream|
      StreamHistory.create!(
        user_name: stream.user_name,
        viewer_count: stream.viewer_count,
        thumbnail_url: stream.thumbnail_url,
        recorded_at: target_date
      )
    end

    puts "history保存"
  end
end
