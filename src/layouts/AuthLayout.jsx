import { Navigate } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthLayout = ({ children }) => {
  if (localStorage.getItem("userId") === null) {
    return <Navigate to="/login" />;
  }
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar />
      <div style={{ marginTop: "64px", display: "flex", width: "100%" }}>
        <Sidebar />

        <div
          style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
