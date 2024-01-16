import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Container, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");
        localStorage.setItem("userId", user.uid);
      })
      .catch((error) => {
        console.log(error.message);

        if (error.message.includes("auth/too-many-requests")) {
          setLoginError("Too many requests. Try again later.");
        } else if (error.message.includes("auth/invalid-credential")) {
          setLoginError("Invalid credentials. Try again.");
        }
      });
  };

  return (
    <div
      className="test_class"
      style={{
        backgroundColor: "#1976d2",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h4" align="center" gutterBottom style={{ color: "#1976d2" }}>
            Delivery Planner
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && (
              <Typography variant="body2" color="error" align="center" gutterBottom>
                {loginError}
              </Typography>
            )}
            <Typography variant="body2" align="center" gutterBottom>
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{ color: "#1976d2", textDecoration: "none" }}>
                Sign up
              </Link>
            </Typography>
            <Button
              sx={{ display: "block", margin: "auto" }}
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: "20px", backgroundColor: "#1976d2", color: "#fff" }}
            >
              Login
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
