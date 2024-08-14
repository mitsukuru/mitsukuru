require "test_helper"

class WebAnalyzerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get web_analyzer_index_url
    assert_response :success
  end

  test "should get analyze" do
    get web_analyzer_analyze_url
    assert_response :success
  end
end
