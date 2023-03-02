//From https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthContext from "../../context/useAuthContext";

const ProtectedRoute = ({ children, redirect }) => {
  const { user, authIsReady } = useAuthContext();
  console.log("USERR", user);

  //check if user is null when auth is ready
  if ((user === null || user === undefined) && authIsReady) {
    // user is not authenticated
    return <Navigate to={redirect} />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  redirect: PropTypes.string,
};

export default ProtectedRoute;
