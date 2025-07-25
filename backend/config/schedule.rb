set :output, "/app/log/cron.log"

#配信者の情報を視聴者順に保存 今はまだ実行しない
#every 5.minutes do
#  rake "stream_histories:save"
#  rake "stream_snapshot:save"
#end

#一日の終わりにsnapshotモデルに上位２０人の情報を持ってくる
#every 1.day, at: '23:59' do
#  rake "stream_histories:save"
#end
