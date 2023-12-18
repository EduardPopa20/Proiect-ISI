import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const Homepage = () => {
  const getUserInfo = async (userId) => {
    try {
      console.log(db);
      const userDocRef = doc(db, "users", userId); // Reference to the user's document
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        // User document found, you can access the user data
        const userData = userSnapshot.data();
        console.log("User info:", userData);
        // Access specific fields, for instance, the first name and last name
        const { firstName, lastName } = userData;
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
      } else {
        console.log("User document not found!");
      }
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };
  console.log(localStorage.getItem("userId"));
  getUserInfo(localStorage.getItem("userId"));
  return <div></div>;
};

export default Homepage;
