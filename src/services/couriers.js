import { getDocs, doc, updateDoc, collection, where, query } from "firebase/firestore";
import { db } from "./firebase";

export const getAllCouriers = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "courier"));
    const querySnapshot = await getDocs(q);
    console.log();

    const res = [];

    querySnapshot.forEach((user) => {
      res.push({
        id: user.id,
        ...user.data(),
      });
    });
    return res;
  } catch (error) {
    console.error("Error fetching couriers:", error);
    return [];
  }
};

export const assignCourierToOrder = async (selectedCourier, selectedOrderId) => {
  try {
    if (!selectedCourier || !selectedOrderId) {
      throw new Error("Both courier and order must be provided.");
    }

    const orderDocRef = doc(db, "orders", selectedOrderId);
    await updateDoc(orderDocRef, {
      courierId: selectedCourier,
      assigned: true,
    });

    console.log("Order assigned successfully!");
  } catch (error) {
    console.error("Error assigning order:", error.message);
    throw error;
  }
};
