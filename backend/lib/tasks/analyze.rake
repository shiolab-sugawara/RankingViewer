namespace :analyze do
  desc "ストリーマーのフォロワー数を取得してログを保存"
  task fetch_followers: :environment do
      FollowerFetcher.new.fetch_and_log
      puts "Fetched follower count"
  end
end
