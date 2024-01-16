import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

const collectionName = "locations";

export const findAllLocations = async () => {
  try {
    const docRefs = await getDocs(collection(db, collectionName));

    const res = [];

    docRefs.forEach((location) => {
      const { name, latitude, longitude } = location.data();
      res.push({
        id: location.id,
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    });

    return res;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};
