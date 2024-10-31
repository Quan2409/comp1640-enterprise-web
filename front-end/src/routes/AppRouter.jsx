import React, { Fragment, useContext } from "react";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import ClientRouter from "./ClientRouter";

export const AppRouter = () => {
  // check user role
  const checkUserRole = (role) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.role) {
      return userData.role === role;
    }
    return false;
  };

  // Wrapper Router - check role before access routes
  const ProtectedRoute = ({ element, role, redirectTo }) => {
    return checkUserRole(role) ? element : <Navigate to={redirectTo} />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ClientRouter />} />

        {/* protected route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              element={<AdminRouter />}
              role="admin"
              redirectTo="/sign-in"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
