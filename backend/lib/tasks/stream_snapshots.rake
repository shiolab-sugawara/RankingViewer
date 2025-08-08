namespace :stream_snapshots do
  desc "Twitchから配信データ保存"
  task save: :environment do
    client = TwitchApiService.new
    streams = client.fetch_top_streams_with_streamer

    StreamSnapshot.delete_all

    streams[:streams].each do |stream|
      StreamSnapshot.create!(
        user_name: stream[:user],
        viewer_count: stream[:viewers],
        thumbnail_url: stream[:thumbnail],
        recorded_at: Time.current,
        started_at: stream[:started_at],
        tags: stream[:tags]
      )
    end
    puts "保存"
  end
end