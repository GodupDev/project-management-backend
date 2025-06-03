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

  // Utility function to create project-related notifications
  async createProjectNotification({
    projectId,
    userId,
    type,
    title,
    message,
    data = {},
  }) {
    try {
      const notificationData = {
        projectId,
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "notifications"),
        notificationData,
      );
      return docRef.id;
    } catch (error) {
      console.error("Failed to create project notification:", error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // Create notification for new task
  async createTaskNotification(projectId, taskData, creatorId) {
    return this.createProjectNotification({
      projectId,
      userId: taskData.assignedTo, // Notify the assigned user
      type: "TASK_CREATED",
      title: "New Task Assigned",
      message: `You have been assigned to task: ${taskData.title}`,
      data: {
        taskId: taskData.id,
        taskTitle: taskData.title,
        creatorId: creatorId,
      },
    });
  }

  // Create notification for task status change
  async createTaskStatusNotification(projectId, taskData, updaterId) {
    return this.createProjectNotification({
      projectId,
      userId: taskData.assignedTo,
      type: "TASK_STATUS_CHANGED",
      title: "Task Status Updated",
      message: `Task "${taskData.title}" status changed to ${taskData.status}`,
      data: {
        taskId: taskData.id,
        taskTitle: taskData.title,
        newStatus: taskData.status,
        updaterId: updaterId,
      },
    });
  }

  // Create notification for new comment
  async createCommentNotification(projectId, commentData, taskData) {
    return this.createProjectNotification({
      projectId,
      userId: taskData.assignedTo,
      type: "NEW_COMMENT",
      title: "New Comment on Task",
      message: `New comment on task: ${taskData.title}`,
      data: {
        taskId: taskData.id,
        taskTitle: taskData.title,
        commentId: commentData.id,
        commenterId: commentData.userId,
      },
    });
  }

  // Create notification for project member added
  async createMemberAddedNotification(
    projectId,
    projectName,
    newMemberId,
    addedById,
  ) {
    return this.createProjectNotification({
      projectId,
      userId: newMemberId,
      type: "MEMBER_ADDED",
      title: "Added to Project",
      message: `You have been added to project: ${projectName}`,
      data: {
        projectName,
        addedById,
      },
    });
  }

  // Create notification for project update
  async createProjectUpdateNotification(
    projectId,
    projectName,
    updateType,
    updaterId,
  ) {
    return this.createProjectNotification({
      projectId,
      type: "PROJECT_UPDATED",
      title: "Project Updated",
      message: `Project "${projectName}" has been updated: ${updateType}`,
      data: {
        projectName,
        updateType,
        updaterId,
      },
    });
  }

  // Create notification for deadline approaching
  async createDeadlineNotification(projectId, taskData) {
    return this.createProjectNotification({
      projectId,
      userId: taskData.assignedTo,
      type: "DEADLINE_APPROACHING",
      title: "Deadline Approaching",
      message: `Task "${taskData.title}" deadline is approaching`,
      data: {
        taskId: taskData.id,
        taskTitle: taskData.title,
        deadline: taskData.deadline,
      },
    });
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

  // Subscribe to notifications for a specific project
  subscribeToProjectNotifications(projectId, callback) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc"),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications = [];
        snapshot.forEach((doc) => {
          notifications.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          });
        });
        callback(notifications);
      });

      // Store the unsubscribe function
      this.subscribers.set(projectId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      throw new Error(`Failed to subscribe to notifications: ${error.message}`);
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

  unsubscribeFromNotifications(projectId) {
    const unsubscribe = this.subscribers.get(projectId);
    if (unsubscribe) {
      unsubscribe();
      this.subscribers.delete(projectId);
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
