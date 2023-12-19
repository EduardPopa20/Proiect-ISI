import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase";

import regexes from "../../utils/regexes";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordsMatchError, setPasswordsMatchError] = useState(false);
  const [passwordStrongError, setPassordStrongError] = useState(false);
  const [validEmailError, setValidEmailError] = useState(true);

  const isEmailValid = (value) => {
    return regexes.email.test(value);
  };

  const isPasswordStrong = (value) => {
    return regexes.strongPassword.test(value);
  };

  const arePasswordsMatching = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  useEffect(() => {
    isEmailValid(email) ? setValidEmailError("") : setValidEmailError("The email is not valid!");
    isPasswordStrong(password)
      ? setPassordStrongError("")
      : setPassordStrongError("The password is not strong enough!");
    arePasswordsMatching(password, confirmPassword)
      ? setPasswordsMatchError("")
      : setPasswordsMatchError("Passwords do not match!");
  }, [email, password, confirmPassword]);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        role: "courier",
      });

      navigate("/home");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
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
          <form onSubmit={handleRegister}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validEmailError ? true : false}
              helperText={validEmailError}
            />
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordStrongError && (
              <Typography variant="body2" color="error" align="left" gutterBottom>
                Password must contain at least one lowercase letter, one uppercase letter, one
                symbol, one number, and be at least 8 characters long.
              </Typography>
            )}
            {passwordsMatchError && (
              <Typography variant="body2" color="error" align="left" gutterBottom>
                Passwords do not match
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ marginTop: "20px", backgroundColor: "#1976d2", color: "#fff" }}
              disabled={passwordStrongError || passwordsMatchError || validEmailError}
            >
              Register
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default RegisterPage;
