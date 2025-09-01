class NotificationService
  class << self
    # コメント追加時の通知
    def create_comment_notification(comment)
      return unless comment.post.user != comment.user
      
      create_notification(
        user: comment.post.user,
        message: "#{comment.user.name}さんがあなたの投稿「#{comment.post.title}」にコメントしました",
        notification_type: Notification::TYPES[:comment],
        target: comment
      )
    end
    
    # リアクション追加時の通知
    def create_reaction_notification(reaction)
      return unless reaction.post.user != reaction.user
      
      emoji_name = get_emoji_name(reaction.reaction_type)
      create_notification(
        user: reaction.post.user,
        message: "#{reaction.user.name}さんがあなたの投稿「#{reaction.post.title}」に#{emoji_name}しました",
        notification_type: Notification::TYPES[:reaction],
        target: reaction
      )
    end
    
    # 投稿公開時の通知（フォロワーがいる場合）
    def create_post_published_notification(post)
      create_notification(
        user: post.user,
        message: "新しい投稿「#{post.title}」を公開しました",
        notification_type: Notification::TYPES[:post_published],
        target: post
      )
    end
    
    # アチーブメント取得時の通知
    def create_achievement_notification(user, achievement_name, description)
      create_notification(
        user: user,
        message: "🏆 新しいアチーブメント「#{achievement_name}」を獲得しました！#{description}",
        notification_type: Notification::TYPES[:achievement],
        target: nil
      )
    end
    
    # システム通知
    def create_system_notification(user, message)
      create_notification(
        user: user,
        message: message,
        notification_type: Notification::TYPES[:system],
        target: nil
      )
    end
    
    # ウェルカム通知
    def create_welcome_notification(user)
      create_system_notification(
        user,
        "🎉 Mitsukuruへようこそ！あなたの開発プロダクトを共有して、他の開発者とつながりましょう。"
      )
    end
    
    private
    
    def create_notification(user:, message:, notification_type:, target: nil)
      Notification.create!(
        user: user,
        message: message,
        notification_type: notification_type,
        target: target,
        read: false
      )
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "通知作成失敗: #{e.message}"
    end
    
    def get_emoji_name(reaction_type)
      case reaction_type
      when 'like'
        '❤️'
      when 'thumbs_up'
        '👍'
      when 'thumbs_down'
        '👎'
      when 'laugh'
        '😂'
      when 'surprised'
        '😮'
      when 'angry'
        '😠'
      else
        'リアクション'
      end
    end
  end
end