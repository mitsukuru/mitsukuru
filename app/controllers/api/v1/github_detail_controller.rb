require 'net/http'
require 'json'

class Api::V1::GithubDetailController < ApplicationController
  before_action :require_login
  
  # リポジトリの詳細情報を取得
  def show_repository
    owner = params[:owner]
    repo = params[:repo]
    
    begin
      repo_data = fetch_github_api("repos/#{owner}/#{repo}")
      
      # 必要な情報を整理
      repository_info = {
        name: repo_data['name'],
        full_name: repo_data['full_name'],
        description: repo_data['description'],
        html_url: repo_data['html_url'],
        clone_url: repo_data['clone_url'],
        ssh_url: repo_data['ssh_url'],
        homepage: repo_data['homepage'],
        size: repo_data['size'],
        stargazers_count: repo_data['stargazers_count'],
        watchers_count: repo_data['watchers_count'],
        forks_count: repo_data['forks_count'],
        open_issues_count: repo_data['open_issues_count'],
        default_branch: repo_data['default_branch'],
        created_at: repo_data['created_at'],
        updated_at: repo_data['updated_at'],
        pushed_at: repo_data['pushed_at'],
        language: repo_data['language'],
        topics: repo_data['topics'],
        license: repo_data['license']&.dig('name'),
        owner: {
          login: repo_data['owner']['login'],
          avatar_url: repo_data['owner']['avatar_url'],
          html_url: repo_data['owner']['html_url']
        }
      }
      
      render json: {
        status: 200,
        repository: repository_info
      }
    rescue => e
      Rails.logger.error "GitHub API Error: #{e.message}"
      render json: {
        status: 500,
        error: 'リポジトリ情報の取得に失敗しました',
        message: e.message
      }, status: :internal_server_error
    end
  end
  
  # リポジトリのコミット履歴を取得
  def show_commits
    owner = params[:owner]
    repo = params[:repo]
    limit = [params[:limit].to_i, 50].min
    limit = 10 if limit <= 0
    
    begin
      commits_data = fetch_github_api("repos/#{owner}/#{repo}/commits?per_page=#{limit}")
      
      commits = commits_data.map do |commit|
        {
          sha: commit['sha'][0..6], # 短縮SHA
          full_sha: commit['sha'],
          message: commit['commit']['message'],
          author: {
            name: commit['commit']['author']['name'],
            email: commit['commit']['author']['email'],
            date: commit['commit']['author']['date']
          },
          committer: commit['commit']['committer'],
          html_url: commit['html_url'],
          stats: commit['stats']
        }
      end
      
      render json: {
        status: 200,
        commits: commits
      }
    rescue => e
      Rails.logger.error "GitHub Commits API Error: #{e.message}"
      render json: {
        status: 500,
        error: 'コミット履歴の取得に失敗しました'
      }, status: :internal_server_error
    end
  end
  
  # リポジトリのコントリビューターを取得
  def show_contributors
    owner = params[:owner]
    repo = params[:repo]
    
    begin
      contributors_data = fetch_github_api("repos/#{owner}/#{repo}/contributors")
      
      contributors = contributors_data.map do |contributor|
        {
          login: contributor['login'],
          avatar_url: contributor['avatar_url'],
          html_url: contributor['html_url'],
          contributions: contributor['contributions'],
          type: contributor['type']
        }
      end
      
      render json: {
        status: 200,
        contributors: contributors
      }
    rescue => e
      Rails.logger.error "GitHub Contributors API Error: #{e.message}"
      render json: {
        status: 500,
        error: 'コントリビューター情報の取得に失敗しました'
      }, status: :internal_server_error
    end
  end
  
  # リポジトリの言語統計を取得
  def show_languages
    owner = params[:owner]
    repo = params[:repo]
    
    begin
      languages_data = fetch_github_api("repos/#{owner}/#{repo}/languages")
      
      total_bytes = languages_data.values.sum
      languages = languages_data.map do |language, bytes|
        {
          name: language,
          bytes: bytes,
          percentage: total_bytes > 0 ? ((bytes.to_f / total_bytes) * 100).round(2) : 0
        }
      end.sort_by { |lang| -lang[:bytes] }
      
      render json: {
        status: 200,
        languages: languages,
        total_bytes: total_bytes
      }
    rescue => e
      Rails.logger.error "GitHub Languages API Error: #{e.message}"
      render json: {
        status: 500,
        error: '言語統計の取得に失敗しました'
      }, status: :internal_server_error
    end
  end
  
  # リポジトリのIssue統計を取得
  def show_issues
    owner = params[:owner]
    repo = params[:repo]
    
    begin
      # オープンなIssuesを取得
      open_issues = fetch_github_api("repos/#{owner}/#{repo}/issues?state=open&per_page=10")
      # クローズドなIssuesの数を取得
      closed_issues = fetch_github_api("repos/#{owner}/#{repo}/issues?state=closed&per_page=1")
      
      issues_summary = {
        open_count: open_issues.length,
        recent_open_issues: open_issues.first(5).map do |issue|
          {
            number: issue['number'],
            title: issue['title'],
            state: issue['state'],
            created_at: issue['created_at'],
            html_url: issue['html_url'],
            user: {
              login: issue['user']['login'],
              avatar_url: issue['user']['avatar_url']
            },
            labels: issue['labels'].map { |label| label['name'] }
          }
        end
      }
      
      render json: {
        status: 200,
        issues: issues_summary
      }
    rescue => e
      Rails.logger.error "GitHub Issues API Error: #{e.message}"
      render json: {
        status: 500,
        error: 'Issue情報の取得に失敗しました'
      }, status: :internal_server_error
    end
  end
  
  private
  
  def fetch_github_api(endpoint)
    github_token = current_user.authentications.find_by(provider: 'github')&.access_token
    
    uri = URI("https://api.github.com/#{endpoint}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    
    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "token #{github_token}" if github_token
    request['Accept'] = 'application/vnd.github.v3+json'
    request['User-Agent'] = 'Mitsukuru-App'
    
    response = http.request(request)
    
    if response.code.to_i >= 400
      error_data = JSON.parse(response.body) rescue {}
      raise "GitHub API Error: #{response.code} - #{error_data['message'] || response.body}"
    end
    
    JSON.parse(response.body)
  end
end