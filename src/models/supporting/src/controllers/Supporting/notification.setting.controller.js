import NotificationSetting from "../models/notificationSettingModel.js";

// Lấy setting của user
export const getNotificationSetting = async (req, res) => {
  try {
    const setting = await NotificationSetting.findOne({ userId: req.user._id });
    if (!setting) {
      return res.status(404).json({ message: "Chưa có cài đặt notification" });
    }
    res.status(200).json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật setting của user
export const updateNotificationSetting = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, desktopNotifications } = req.body;

    const updatedSetting = await NotificationSetting.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          ...(emailNotifications && { emailNotifications }),
          ...(pushNotifications && { pushNotifications }),
          ...(desktopNotifications && { desktopNotifications }),
        },
      },
      { new: true, upsert: true } // upsert để nếu chưa có thì tạo mới
    );

    res.status(200).json({
      message: "Cập nhật cài đặt notification thành công",
      data: updatedSetting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
