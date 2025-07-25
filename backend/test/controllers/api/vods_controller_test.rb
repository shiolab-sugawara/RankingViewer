require "test_helper"

class Api::VodsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_vods_index_url
    assert_response :success
  end
end
