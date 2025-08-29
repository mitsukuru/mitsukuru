class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render json: { users: users }
  end

  def show
    user = User.find(params[:id])
    posts = user.posts.includes(:tags)
    
    # プロダクトの統計情報を計算
    total_posts = posts.count
    total_tags = posts.joins(:tags).count
    unique_tags = posts.joins(:tags).select('tags.name').distinct.count
    
    # 最新の投稿日
    latest_post_date = posts.maximum(:created_at)
    
    # タグ別投稿数（上位10個）
    popular_tags = Tag.joins(:posts)
                      .where(posts: { user_id: user.id })
                      .group('tags.name')
                      .order('COUNT(posts.id) DESC')
                      .limit(10)
                      .count
    
    # 月別投稿数（過去12ヶ月）
    monthly_posts = posts.where(created_at: 12.months.ago.beginning_of_month..Time.current.end_of_month)
                         .group("strftime('%Y-%m', created_at)")
                         .count
    
    # ゲーミフィケーション要素
    gamification_data = calculate_gamification_stats(user, posts)
    
    render json: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        remote_avatar_url: user.remote_avatar_url
      },
      statistics: {
        total_posts: total_posts,
        total_tags: total_tags,
        unique_tags: unique_tags,
        latest_post_date: latest_post_date,
        popular_tags: popular_tags,
        monthly_posts: monthly_posts,
        average_tags_per_post: total_posts > 0 ? (total_tags.to_f / total_posts).round(2) : 0
      },
      gamification: gamification_data,
      recent_posts: posts.limit(5).as_json(
        include: {
          tags: { only: [:id, :name] }
        }
      )
    }
  end

  def me
    Rails.logger.info "認証状態確認: session[:user_id]=#{session[:user_id]}, current_user=#{current_user&.id}"
    
    if logged_in?
      Rails.logger.info "認証済みユーザー: #{current_user.name} (ID: #{current_user.id})"
      render json: {
        authenticated: true,
        user: {
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          remote_avatar_url: current_user.remote_avatar_url
        }
      }
    else
      Rails.logger.info "未認証ユーザー"
      render json: {
        authenticated: false,
        user: nil
      }
    end
  end

  private

  def calculate_gamification_stats(user, posts)
    # 連続投稿日数（ストリーク）
    current_streak = calculate_posting_streak(posts)
    longest_streak = calculate_longest_streak(posts)
    
    # レベルシステム（投稿数に基づく）
    level_data = calculate_level(posts.count)
    
    # アチーブメント
    achievements = calculate_achievements(user, posts)
    
    # 今日の目標進捗
    today_progress = calculate_daily_progress(user, posts)
    
    # 週間統計
    weekly_stats = calculate_weekly_stats(posts)
    
    {
      current_streak: current_streak,
      longest_streak: longest_streak,
      level: level_data[:level],
      level_progress: level_data[:progress],
      next_level_posts: level_data[:next_level_posts],
      achievements: achievements,
      today_progress: today_progress,
      weekly_stats: weekly_stats,
      motivation_message: generate_motivation_message(current_streak, level_data[:level])
    }
  end

  def calculate_posting_streak(posts)
    return 0 if posts.empty?
    
    sorted_dates = posts.pluck(:created_at).map(&:to_date).uniq.sort.reverse
    return 0 if sorted_dates.empty?
    
    streak = 0
    current_date = Date.current
    
    sorted_dates.each do |date|
      if date == current_date - streak.days
        streak += 1
      else
        break
      end
    end
    
    streak
  end

  def calculate_longest_streak(posts)
    return 0 if posts.empty?
    
    dates = posts.pluck(:created_at).map(&:to_date).uniq.sort
    max_streak = 0
    current_streak = 1
    
    (1...dates.length).each do |i|
      if dates[i] == dates[i-1] + 1.day
        current_streak += 1
      else
        max_streak = [max_streak, current_streak].max
        current_streak = 1
      end
    end
    
    [max_streak, current_streak].max
  end

  def calculate_level(post_count)
    # レベル計算: 1レベルにつき3投稿必要
    level = (post_count / 3) + 1
    progress = ((post_count % 3) / 3.0 * 100).round
    next_level_posts = 3 - (post_count % 3)
    
    {
      level: level,
      progress: progress,
      next_level_posts: next_level_posts
    }
  end

  def calculate_achievements(user, posts)
    achievements = []
    
    # 初回投稿
    achievements << { name: "First Steps", description: "初回投稿完了", icon: "🎯", unlocked: posts.count >= 1 }
    
    # 継続投稿
    achievements << { name: "Getting Started", description: "5つの投稿を達成", icon: "🚀", unlocked: posts.count >= 5 }
    achievements << { name: "Productive", description: "10個の投稿を達成", icon: "⭐", unlocked: posts.count >= 10 }
    achievements << { name: "Prolific Creator", description: "20個の投稿を達成", icon: "🏆", unlocked: posts.count >= 20 }
    
    # 技術の多様性
    unique_tags = posts.joins(:tags).select('tags.name').distinct.count
    achievements << { name: "Tech Explorer", description: "5つの技術を使用", icon: "🔧", unlocked: unique_tags >= 5 }
    achievements << { name: "Full Stack", description: "10つの技術を使用", icon: "💻", unlocked: unique_tags >= 10 }
    
    # ストリーク
    current_streak = calculate_posting_streak(posts)
    achievements << { name: "Consistent", description: "3日連続投稿", icon: "🔥", unlocked: current_streak >= 3 }
    achievements << { name: "Dedicated", description: "7日連続投稿", icon: "💪", unlocked: current_streak >= 7 }
    
    achievements
  end

  def calculate_daily_progress(user, posts)
    today = Date.current
    posts_today = posts.where(created_at: today.beginning_of_day..today.end_of_day).count
    
    # 毎日の目標: 1投稿
    daily_goal = 1
    progress_percentage = [(posts_today.to_f / daily_goal * 100).round, 100].min
    
    {
      posts_today: posts_today,
      daily_goal: daily_goal,
      progress_percentage: progress_percentage,
      completed: posts_today >= daily_goal
    }
  end

  def calculate_weekly_stats(posts)
    week_start = Date.current.beginning_of_week
    week_end = Date.current.end_of_week
    
    weekly_posts = posts.where(created_at: week_start..week_end).count
    weekly_goal = 3 # 週3投稿目標
    
    {
      posts_this_week: weekly_posts,
      weekly_goal: weekly_goal,
      progress_percentage: [(weekly_posts.to_f / weekly_goal * 100).round, 100].min
    }
  end

  def generate_motivation_message(streak, level)
    messages = {
      high_streak: [
        "🔥 素晴らしい継続力です！",
        "💪 その調子でコーディングを続けましょう！",
        "⭐ あなたの努力が実を結んでいます！"
      ],
      medium_streak: [
        "🚀 良いペースで進んでいます！",
        "🎯 継続は力なり、頑張りましょう！",
        "💡 新しいアイデアを形にしましょう！"
      ],
      low_streak: [
        "🌟 新しい一歩を踏み出しましょう！",
        "🎨 創造の時間です！",
        "💻 今日も新しいプロダクトを作りましょう！"
      ]
    }
    
    if streak >= 7
      messages[:high_streak].sample
    elsif streak >= 3
      messages[:medium_streak].sample
    else
      messages[:low_streak].sample
    end
  end

  def user_params
    params.require(:user).permit(:username, :email, :name)
  end
end
