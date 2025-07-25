require "test_helper"

class Api::SubscriberLogsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_subscriber_logs_index_url
    assert_response :success
  end
end
