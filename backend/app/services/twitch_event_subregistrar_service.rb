class TwitchEventSubregistrarService
  def initialize
    @api = TwitchAPIService.new
  end

  def register_streamer
    res = @api.register_eventsub("kato_junichi0817")
    if res.code == 202
      Rails.logger.info "登録成功"
    else
      Rails.logger.error "登録失敗 #{res.body}"
    end
  end
end
