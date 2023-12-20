import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar />
      <Sidebar />

      <div>{children && <div>{children}</div>}</div>
    </div>
  );
};

export default AuthLayout;
