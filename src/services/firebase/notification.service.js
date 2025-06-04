import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebase.config.js";

class NotificationService {
  constructor() {
    this.subscribers = new Map();
  }
  // Original methods remain unchanged
  async createNotification(data) {
    try {
      const notificationData = {
        ...data,
        isRead: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "notifications"),
        notificationData,
      );
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // Get notifications for a specific project
  async getProjectNotifications(projectId) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
    } catch (error) {
      throw new Error(`Failed to get project notifications: ${error.message}`);
    }
  }

  async createNewNotification(data) {
    try {
      const notificationsRef = collection(db, "notifications");

      if (!data.userId) {
        throw new Error("User ID is required for notifications");
      }

      if (!data.projectId) {
        throw new Error("Project ID is required for notifications");
      }

      const message = this.generateMessage(
        data.actionType,
        data.taskName,
        data.userId,
        data.additionalInfo,
      );

      const notificationData = {
        userId: data.userId,
        projectId: data.projectId,
        taskId: data.taskId || null,
        type: data.actionType,
        message,
        isRead: false,
        createdAt: serverTimestamp(),
      };

      console.log("Creating notification with data:", notificationData);

      const docRef = await addDoc(notificationsRef, notificationData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  generateMessage(actionType, taskName, userId, additionalInfo) {
    switch (actionType) {
      case "TASK_CREATED":
        return `New task "${taskName}" has been created`;
      case "TASK_UPDATED":
        return `Task "${taskName}" has been updated`;
      case "TASK_DELETED":
        return `Task "${taskName}" has been deleted`;
      case "TASK_ASSIGNED":
        return `You have been assigned to task "${taskName}"`;
      case "TASK_COMPLETED":
        return `Task "${taskName}" has been completed`;
      case "COMMENT_ADDED":
        return `New comment on task "${taskName}"`;
      case "PROJECT_UPDATED":
        return `Project has been updated`;
      case "MEMBER_ADDED":
        return `New member has been added to the project`;
      default:
        return `Notification: ${actionType}`;
    }
  }

  // Get notifications for a user in a specific project
  async getUserProjectNotifications(userId, projectId) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("projectId", "==", projectId),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
    } catch (error) {
      throw new Error(
        `Failed to get user project notifications: ${error.message}`,
      );
    }
  }

  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  async markAllAsRead(projectId, userId = null) {
    try {
      let q = query(
        collection(db, "notifications"),
        where("projectId", "==", projectId),
        where("isRead", "==", false),
      );

      // If userId is provided, add it to the query
      if (userId) {
        q = query(q, where("userId", "==", userId));
      }

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          isRead: true,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      throw new Error(
        `Failed to mark all notifications as read: ${error.message}`,
      );
    }
  }
}

export default new NotificationService();
