export const generateNotificationMessage = (type, data) => {
  const currentTime = new Date().toLocaleString("vi-VN");

  switch (type) {
    case "comment":
      return `${data.userName} đã comment vào task "${data.taskName}" lúc ${currentTime}`;

    case "task_created":
      return `${data.userName} đã tạo task mới "${data.taskName}" lúc ${currentTime}`;

    case "task_completed":
      return `${data.userName} đã hoàn thành task "${data.taskName}" lúc ${currentTime}`;

    case "task_updated":
      return `${data.userName} đã cập nhật task "${data.taskName}" lúc ${currentTime}`;

    case "task_deleted":
      return `${data.userName} đã xóa task "${data.taskName}" lúc ${currentTime}`;

    default:
      return `Bạn có một thông báo mới lúc ${currentTime}`;
  }
};
