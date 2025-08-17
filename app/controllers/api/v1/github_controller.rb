class Api::V1::GithubController < ApplicationController
  before_action :require_login

  def repositories
    begin
      # 環境変数のGitHub設定を使用
      github_token = ENV['GITHUB_TOKEN']
      github_api_base_url = ENV['GITHUB_API_BASE_URL'] || 'https://api.github.com'
      
      unless github_token.present?
        Rails.logger.error "GITHUB_TOKEN environment variable is not set"
        render json: { 
          error: 'GitHub設定エラー',
          message: 'GitHub APIの設定が正しくありません。',
        }, status: :internal_server_error
        return
      end

      Rails.logger.info "Using environment variable GITHUB_TOKEN for API access"
      Rails.logger.info "GitHub API Base URL: #{github_api_base_url}"

      # GitHub APIを使用してリポジトリを取得
      require 'net/http'
      require 'uri'
      require 'json'

      uri = URI("#{github_api_base_url}/user/repos")
      uri.query = URI.encode_www_form({
        sort: 'updated',
        per_page: 100,
        type: 'owner'  # 自分が所有するリポジトリのみ
      })

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Get.new(uri)
      request['Authorization'] = "Bearer #{github_token}"
      request['Accept'] = 'application/vnd.github.v3+json'
      request['User-Agent'] = 'Mitsukuru-App'

      Rails.logger.info "Making GitHub API request to: #{uri}"
      response = http.request(request)
      
      if response.code == '200'
        repositories = JSON.parse(response.body)
        
        # 必要な情報のみを抽出
        repo_data = repositories.map do |repo|
          {
            id: repo['id'],
            name: repo['name'],
            full_name: repo['full_name'],
            description: repo['description'],
            html_url: repo['html_url'],
            clone_url: repo['clone_url'],
            ssh_url: repo['ssh_url'],
            language: repo['language'],
            stargazers_count: repo['stargazers_count'],
            forks_count: repo['forks_count'],
            updated_at: repo['updated_at'],
            created_at: repo['created_at'],
            private: repo['private'],
            topics: repo['topics'] || []
          }
        end

        render json: { repositories: repo_data }
      else
        Rails.logger.error "GitHub API Error: #{response.code} - #{response.body}"
        render json: { error: 'GitHubリポジトリの取得に失敗しました' }, status: :bad_gateway
      end

    rescue StandardError => e
      Rails.logger.error "Repository fetch error: #{e.message}"
      render json: { error: 'リポジトリの取得中にエラーが発生しました' }, status: :internal_server_error
    end
  end

  private

  def require_login
    unless current_user
      render json: { error: 'Authentication required' }, status: :unauthorized
    end
  end
end