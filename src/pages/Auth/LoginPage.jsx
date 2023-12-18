import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div
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
