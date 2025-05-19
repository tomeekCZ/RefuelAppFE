import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
