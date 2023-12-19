import { getDocs, collection, doc, getDoc } from "firebase/firestore";

import { db } from "./firebase";

export const findAll = async () => {
  const doc_refs = await getDocs(collection(db, "users"));
  const res = [];

  doc_refs.forEach((user) => {
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
