import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firebase.config.js";

class FirebaseFirestoreService {
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Document creation failed: ${error.message}`);
    }
  }

  async update(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Document update failed: ${error.message}`);
    }
  }

  async delete(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(`Document deletion failed: ${error.message}`);
    }
  }

  async getById(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(`Document retrieval failed: ${error.message}`);
    }
  }

  async getAll(
    collectionName,
    conditions = [],
    orderByField = null,
    limitCount = null,
  ) {
    try {
      let q = collection(db, collectionName);

      if (conditions.length > 0) {
        q = query(
          q,
          ...conditions.map((condition) =>
            where(condition.field, condition.operator, condition.value),
          ),
        );
      }

      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Documents retrieval failed: ${error.message}`);
    }
  }
}

export default new FirebaseFirestoreService();
