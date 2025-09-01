class Api::V1::NotificationsController < ApplicationController
  before_action :require_login
  before_action :find_notification, only: [:show, :update, :destroy]
  
  def index
    notifications = current_user.notifications
                                .includes(:target)
                                .recent
                                .limit(params[:limit] || 50)
                                .offset(params[:offset] || 0)
    
    unread_count = current_user.unread_notifications_count
    
    render json: {
      notifications: notifications.map do |notification|
        {
          id: notification.id,
          message: notification.message,
          notification_type: notification.notification_type,
          icon: notification.icon,
          read: notification.read,
          target_type: notification.target_type,
          target_id: notification.target_id,
          created_at: notification.created_at,
          time_ago: time_ago_in_words(notification.created_at)
        }
      end,
      unread_count: unread_count,
      total_count: current_user.notifications.count
    }
  end
  
  def show
    render json: {
      notification: {
        id: @notification.id,
        message: @notification.message,
        notification_type: @notification.notification_type,
        icon: @notification.icon,
        read: @notification.read,
        target_type: @notification.target_type,
        target_id: @notification.target_id,
        created_at: @notification.created_at,
        time_ago: time_ago_in_words(@notification.created_at)
      }
    }
  end
  
  def update
    if @notification.update(notification_params)
      render json: {
        status: 200,
        notification: {
          id: @notification.id,
          message: @notification.message,
          read: @notification.read
        }
      }
    else
      render json: {
        status: 422,
        errors: @notification.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  def destroy
    @notification.destroy
    render json: { status: 200, message: '通知を削除しました' }
  end
  
  # 全ての通知を既読にする
  def mark_all_as_read
    current_user.notifications.unread.update_all(read: true)
    render json: { 
      status: 200, 
      message: '全ての通知を既読にしました',
      unread_count: 0
    }
  end
  
  # 通知を既読にする
  def mark_as_read
    @notification = current_user.notifications.find(params[:id])
    @notification.mark_as_read!
    render json: {
      status: 200,
      message: '通知を既読にしました',
      unread_count: current_user.unread_notifications_count
    }
  rescue ActiveRecord::RecordNotFound
    render json: { status: 404, error: '通知が見つかりません' }, status: :not_found
  end
  
  private
  
  def find_notification
    @notification = current_user.notifications.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: 404, error: '通知が見つかりません' }, status: :not_found
  end
  
  def notification_params
    params.require(:notification).permit(:read)
  end
  
  def time_ago_in_words(time)
    distance = Time.current - time
    
    case distance
    when 0...60
      "#{distance.to_i}秒前"
    when 60...3600
      "#{(distance / 60).to_i}分前"
    when 3600...86400
      "#{(distance / 3600).to_i}時間前"
    when 86400...604800
      "#{(distance / 86400).to_i}日前"
    else
      time.strftime('%Y年%m月%d日')
    end
  end
end