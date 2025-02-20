import { Route, Routes, Navigate } from "react-router-dom";
import ForgotPassword from "src/pages/Auth/ForgotPassword";
import Login from "src/pages/Auth/Login";
import ResetPassword from "src/pages/Auth/ResetPassword";
import SetupPassword from "src/pages/Auth/SetupPassword";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="sign-up" element={<SetupPassword />} />
    </Routes>
  );
};

export default AuthRoutes;
