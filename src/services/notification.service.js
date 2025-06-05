import notificationModel from "../models/supporting/notification.model.js";

const createNotification = async ({ authorId, projectId, content, Types }) => {
  if (!authorId || !projectId || !content || !Types) {
    throw new Error("Missing required fields");
  }

  const newNotification = new notificationModel({
    authorId,
    projectId,
    content,
    Types,
  });

  await newNotification.save();
  return newNotification;
};

export default createNotification;
