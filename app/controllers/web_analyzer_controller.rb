class WebAnalyzerController < ApplicationController
  def index
  end

  def analyze
    url = params[:url]
    begin
      scraped_data = WebScraper.new(url).call
      analysis = AiAnalyzer.new(scraped_data).call
      render json: { success: true, analysis: analysis }
    rescue StandardError => e
      Rails.logger.error "Error in analyze action: #{e.message}"
      render json: { success: false, error: "分析中にエラーが発生しました。もう一度お試しください。" }, status: :internal_server_error
    end
  end
end
