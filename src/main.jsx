import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import RecoverPasswordPage from "./pages/Auth/RecoverPasswordPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import Homepage from "./pages/Homepage.jsx";
import AddOrderPage from "./pages/Order/AddOrderPage.jsx";

import Paths from "./resources/Paths.js";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={Paths.login} element={<LoginPage />} />
        <Route path={Paths.register} element={<RegisterPage />} />
        <Route path={Paths.forgotPassword} element={<RecoverPasswordPage />} />
        <Route path={Paths.resetPassword} element={<ResetPasswordPage />} />
        <Route path={Paths.homepage} element={<Homepage />} />
        <Route path={Paths.addOrder} element={<AddOrderPage />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
