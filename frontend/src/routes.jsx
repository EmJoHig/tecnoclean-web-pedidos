// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "./context/authContext";

// export const ProtectedRoute = () => {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading) return <h1>Loading...</h1>;
//   if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;
//   return <Outlet />;
// };


import React, { useEffect } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const roles = user && user["https://tecnoclean/api/roles"];

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) return <h1>Loading...</h1>;

  if (!isAuthenticated && !isLoading) {
    return null; // Evita que el componente siga renderizando
  }

  // Si hay roles requeridos y el usuario no tiene ninguno de ellos, redirigir
  if (allowedRoles.length > 0 && !roles?.some(role => allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
