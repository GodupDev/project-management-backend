import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../config/firebase.config.js";

class FirebaseStorageService {
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  async getFileUrl(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }
}

export default new FirebaseStorageService();
