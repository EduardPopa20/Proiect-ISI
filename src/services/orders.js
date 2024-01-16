import { db } from "./firebase";
import { collection, addDoc, getDocs, where, query, doc } from "firebase/firestore";

export const getUndeliveredOrders = async () => {
  try {
    const ordersCollection = collection(db, "orders");
    const unassignedOrdersQuery = query(ordersCollection, where("delivered", "==", false));
    const querySnapshot = await getDocs(unassignedOrdersQuery);

    const undeliveredOrders = [];

    const couriersCollection = collection(db, "couriers");

    for (const orderDoc of querySnapshot.docs) {
      const orderData = orderDoc.data();
      const courierId = orderData.courierId;
      let courierDocument;

      if (courierId) {
        courierDocument = await getDocs(doc(db, couriersCollection, courierId));
      }

      let courierName = courierDocument
        ? `${courierDocument.data().firstName} ${courierDocument.data().lastName}`
        : "Not assigned";

      undeliveredOrders.push({
        id: orderDoc.id,
        ...orderData,
        courierName,
      });

      console.log(undeliveredOrders);
    }

    return undeliveredOrders;
  } catch (error) {
    console.error("Error fetching undelivered orders:", error.message);
    throw error;
  }
};

export const getUnassignedOrders = async () => {
  try {
    const ordersCollection = collection(db, "orders");
    const unassignedOrdersQuery = query(ordersCollection, where("assigned", "==", false));
    const querySnapshot = await getDocs(unassignedOrdersQuery);

    const unassignedOrders = [];
    querySnapshot.forEach((doc) => {
      unassignedOrders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return unassignedOrders;
  } catch (error) {
    console.error("Error fetching unassigned orders:", error.message);
    throw error;
  }
};

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
      assigned: false,
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error adding order:", error.message);
    throw error;
  }
};
