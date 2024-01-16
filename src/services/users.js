import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";

import { db } from "./firebase";

export const findAll = async () => {
  const docRefs = await getDocs(collection(db, "users"));
  const res = [];

  docRefs.forEach((user) => {
    res.push({
      id: user.id,
      ...user.data(),
    });
  });

  return res;
};

export const getCurrentUserById = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return {
        id: userSnapshot.id,
        ...userSnapshot.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const auth = getAuth();

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

