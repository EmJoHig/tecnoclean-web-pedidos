// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "./context/authContext";

// export const ProtectedRoute = () => {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading) return <h1>Loading...</h1>;
//   if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;
//   return <Outlet />;
// };


import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const ProtectedRoute = ({ allowedRoles }) => {

  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();


  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);



  if (isLoading) return <h1>Loading...</h1>;

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect();
    return null; // Evita que el componente siga renderizando
  }
  // if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect();
    return null; // Retorna null para evitar que el componente siga renderizando.
  }

  return <Outlet />;
};
