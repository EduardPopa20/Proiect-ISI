import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
