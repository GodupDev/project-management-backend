import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase.config.js";

class FirebaseAuthService {
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}

export default new FirebaseAuthService();
