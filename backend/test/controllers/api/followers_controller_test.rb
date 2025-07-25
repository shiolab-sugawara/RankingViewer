require "test_helper"

class Api::FollowersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_followers_index_url
    assert_response :success
  end
end
