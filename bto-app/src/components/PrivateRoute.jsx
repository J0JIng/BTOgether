/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/"></Navigate>;
};
