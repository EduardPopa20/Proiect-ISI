import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const addLocation = async (locationData) => {
  try {
    const locationRef = await addDoc(collection(db, "locations"), {
      name: locationData.name,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });
    return locationRef.id;
  } catch (error) {
    console.error("Error adding location:", error.message);
    throw error;
  }
};

export const addOrder = async (orderData, addedLocationId) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      name: orderData.name,
      location_id: addedLocationId,
      weight: orderData.weight,
      delivered: orderData.delivered,
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error adding order:", error.message);
    throw error;
  }
};
