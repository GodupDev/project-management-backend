import Notification from "../models/notification.model.js";
import NotificationSetting from "../models/notificationSetting.model.js";

export const notificationService = {
  // Phương thức cũ giữ nguyên...
  
  /**
   * Tạo thông báo dựa trên cài đặt người dùng
   */
  async createWithUserPreference(userId, title, message, type, reference = null) {
    try {
      // Kiểm tra cài đặt của người dùng
      const settings = await NotificationSetting.findOne({ user: userId });
      
      // Nếu không có cài đặt hoặc loại thông báo này được cho phép
      if (!settings || this._isNotificationEnabled(settings, type)) {
        const deliveryChannels = this._getDeliveryChannels(settings, type);
        
        const notification = {
          user: userId,
          title,
          message,
          type,
          deliveryChannels,
        };
        
        if (reference) {
          notification.referenceId = reference.id;
          notification.referenceModel = reference.model;
        }
        
        return await Notification.create(notification);
      }
      return null;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  },
  
  _isNotificationEnabled(settings, type) {
    if (!settings) return true;
    
    // Kiểm tra xem loại thông báo có được bật trong bất kỳ kênh nào
    const typeMap = {
      'task_update': 'taskUpdates',
      'project_update': 'projectUpdates',
      'mention': 'mentions',
      'comment': 'comments',
      'system': null // System notifications are always enabled
    };
    
    const settingKey = typeMap[type];
    if (!settingKey) return true; // System notifications always enabled
    
    return (
      settings.email?.[settingKey] ||
      settings.push?.[settingKey] ||
      settings.desktop?.[settingKey]
    );
  },
  
  _getDeliveryChannels(settings, type) {
    if (!settings) return { email: true, push: true, desktop: true };
    
    const typeMap = {
      'task_update': 'taskUpdates',
      'project_update': 'projectUpdates',
      'mention': 'mentions',
      'comment': 'comments'
    };
    
    const settingKey = typeMap[type];
    if (!settingKey) return { email: true, push: true, desktop: true };
    
    return {
      email: settings.email?.[settingKey] ?? true,
      push: settings.push?.[settingKey] ?? true,
      desktop: settings.desktop?.[settingKey] ?? true
    };
  }
};