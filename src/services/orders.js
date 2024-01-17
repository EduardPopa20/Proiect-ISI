import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  where,
  query,
  doc,
  updateDoc,
  Timestamp
} from "firebase/firestore";

export const getUndeliveredOrders = async () => {
  try {
    const ordersCollection = collection(db, "orders");
    const undeliveredOrdersQuery = query(ordersCollection, where("delivered", "==", false));
    const querySnapshot = await getDocs(undeliveredOrdersQuery);
    const undeliveredOrders = [];

    for (const orderDoc of querySnapshot.docs) {
      const orderData = orderDoc.data();

      const locationId = orderData.location_id;
      let locationDocument;

      const courierId = orderData.courierId;
      let courierDocument;

      if (courierId) {
        const courierRef = doc(db, "users", courierId);
        const courierSnapshot = await getDoc(courierRef);
        courierDocument = courierSnapshot.data();

        const locationRef = doc(db, "locations", locationId);
        const locationSnapshot = await getDoc(locationRef);
        locationDocument = locationSnapshot.data();
      }

      let courierName = courierDocument
        ? `${courierDocument.firstName} ${courierDocument.lastName}`
        : "Not assigned";

      let locationName = locationDocument ? locationDocument.name : "-";

      undeliveredOrders.push({
        id: orderDoc.id,
        ...orderData,
        courierName,
        locationName,
      });
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

export const updateOrderStatus = async (orderId, newStatus) => {
  const orderRef = doc(db, "orders", orderId);

  try {
    await updateDoc(orderRef, { delivered: newStatus });
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const getDeliveredOrders = async () => {
  try {
    const ordersCollection = collection(db, "orders");
    const deliveredOrdersQuery = query(ordersCollection, where("delivered", "==", true));
    const querySnapshot = await getDocs(deliveredOrdersQuery);
    const deliveredOrders = [];

    for (const orderDoc of querySnapshot.docs) {
      const orderData = orderDoc.data();

      const locationId = orderData.location_id;
      let locationDocument;

      const courierId = orderData.courierId;
      let courierDocument;

      if (courierId) {
        const courierRef = doc(db, "users", courierId);
        const courierSnapshot = await getDoc(courierRef);
        courierDocument = courierSnapshot.data();

        const locationRef = doc(db, "locations", locationId);
        const locationSnapshot = await getDoc(locationRef);
        locationDocument = locationSnapshot.data();
      }

      let courierName = courierDocument
        ? `${courierDocument.firstName} ${courierDocument.lastName}`
        : "Not assigned";

      let locationName = locationDocument ? locationDocument.name : "-";

      deliveredOrders.push({
        id: orderDoc.id,
        ...orderData,
        courierName,
        locationName,
      });
    }
    return deliveredOrders;
  } catch (error) {
    console.error("Error fetching undelivered orders:", error.message);
    throw error;
  }
};

export const getOrdersAssignedForTodayByCourierId = async (courierId) => {
  try {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

    const ordersCollection = collection(db, "orders");
    const assignedOrdersQuery = query(ordersCollection, where("courierId", "==", courierId), 
                                where('toBeDeliveredOn', '>=', Timestamp.fromDate(startOfToday)),
                                where('toBeDeliveredOn', '<=', Timestamp.fromDate(endOfToday)));
    const querySnapshot = await getDocs(assignedOrdersQuery);
    const assignedOrders = [];
    for (const orderDoc of querySnapshot.docs) {
      const orderData = orderDoc.data();

      console.log(orderData);
      const locationId = orderData.location_id;
      let locationDocument;

      const locationRef = doc(db, "locations", locationId);
      const locationSnapshot = await getDoc(locationRef);
      locationDocument = locationSnapshot.data();
      
      let locationName = locationDocument ? locationDocument.name : "-";

      assignedOrders.push({
        id: orderDoc.id,
        ...orderData,
        locationName,
      });
    }
    return assignedOrders;
  } catch (error) {
    console.error("Error fetching assigned orders for courier :", error.message);
    throw error;
  }
}