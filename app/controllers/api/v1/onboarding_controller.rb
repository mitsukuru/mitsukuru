class Api::V1::OnboardingController < ApplicationController
  # オンボーディング時は一時的に認証を緩和
  # before_action :require_login
  
  def get_repositories
    begin
      # セッションベースまたはパラメータからユーザーを取得
      user = current_user
      
      # セッションにユーザーがいない場合、パラメータから取得
      if !user && params[:user_id]
        user = User.find_by(id: params[:user_id])
      end
      
      unless user
        render json: { error: 'ユーザー情報が見つかりません' }, status: :unauthorized
        return
      end
      
      # GitHub認証を確認
      github_auth = user.authentications.find_by(provider: 'github')
      unless github_auth
        render json: { error: 'GitHub認証が見つかりません' }, status: :unauthorized
        return
      end
      
      # テスト用のモックリポジトリデータ（GitHub APIの代替）
      mock_repositories = [
        {
          id: 1,
          name: "my-awesome-app",
          full_name: "#{user.name}/my-awesome-app",
          description: "React + TypeScriptで作った素晴らしいアプリです",
          html_url: "https://github.com/#{user.name}/my-awesome-app",
          language: "TypeScript",
          stargazers_count: 5,
          updated_at: 1.day.ago
        },
        {
          id: 2,
          name: "portfolio-site",
          full_name: "#{user.name}/portfolio-site",
          description: "Next.jsで作ったポートフォリオサイト",
          html_url: "https://github.com/#{user.name}/portfolio-site",
          language: "JavaScript",
          stargazers_count: 12,
          updated_at: 3.days.ago
        },
        {
          id: 3,
          name: "todo-app",
          full_name: "#{user.name}/todo-app",
          description: "シンプルなTodoアプリ",
          html_url: "https://github.com/#{user.name}/todo-app",
          language: "React",
          stargazers_count: 8,
          updated_at: 1.week.ago
        }
      ]
      
      render json: { repositories: mock_repositories }
    rescue => e
      Rails.logger.error "Repository fetch error: #{e.message}"
      render json: { error: 'リポジトリの取得に失敗しました' }, status: :internal_server_error
    end
  end
  
  def complete_onboarding
    begin
      # セッションベースまたはパラメータからユーザーを取得
      user = current_user
      
      # セッションにユーザーがいない場合、パラメータから取得
      if !user && params[:user_id]
        user = User.find_by(id: params[:user_id])
      end
      
      unless user
        render json: { error: 'ユーザー情報が見つかりません' }, status: :unauthorized
        return
      end
      
      repository_data = params[:repository]
      
      unless repository_data
        render json: { error: 'リポジトリデータが必要です' }, status: :bad_request
        return
      end
      
      # 選択されたリポジトリの情報でポストを作成
      post = user.posts.create!(
        title: repository_data[:name],
        description: repository_data[:description] || "#{repository_data[:name]}の開発プロジェクト",
        body: generate_post_body(repository_data),
        repository_name: repository_data[:name],
        repository_url: repository_data[:html_url],
        repository_description: repository_data[:description]
      )
      
      # オンボーディング完了フラグを設定
      user.update!(onboarding_completed: true)
      
      render json: { 
        message: 'オンボーディングが完了しました',
        post: {
          id: post.id,
          title: post.title,
          description: post.description
        }
      }
    rescue => e
      Rails.logger.error "Onboarding Error: #{e.message}"
      render json: { error: 'オンボーディングの完了に失敗しました' }, status: :internal_server_error
    end
  end
  
  private
  
  def generate_post_body(repository_data)
    language = repository_data[:language] || 'プログラミング言語'
    
    body = "## プロジェクト概要\n"
    body += repository_data[:description] ? "#{repository_data[:description]}\n\n" : "個人開発プロジェクトです。\n\n"
    
    body += "## 技術スタック\n"
    body += "- #{language}\n"
    body += "- その他の技術スタック\n\n"
    
    body += "## 主な機能\n"
    body += "- 機能1\n"
    body += "- 機能2\n"
    body += "- 機能3\n\n"
    
    body += "[GitHub](#{repository_data[:html_url]})"
    
    body
  end
end
