import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADfC9pW6XDAWaSpuI1WwWl-oqlCZUaTQw",
  authDomain: "delivery-planner-20a79.firebaseapp.com",
  projectId: "delivery-planner-20a79",
  storageBucket: "delivery-planner-20a79.appspot.com",
  messagingSenderId: "596850624994",
  appId: "1:596850624994:web:1dcf128059a23be86e11bb",
  measurementId: "G-9150SR23QP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
