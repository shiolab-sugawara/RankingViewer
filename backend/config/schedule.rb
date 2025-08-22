set :environment, ENV['RAILS_ENV'] || 'production'
set :path, '/app'
set :output, { standard: "/proc/1/fd/1", error: "/proc/1/fd/2" }

ENV.each { |k, v| env(k, v) }

every 5.minutes do
  rake "stream_snapshots:save"
end

every 1.day, at: '23:59' do
  #rake "analyze:fetch_followers"
  rake "stream_histories:save"
end