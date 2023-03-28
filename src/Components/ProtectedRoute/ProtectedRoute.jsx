//From https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebase";

const ProtectedRoute = ({ children, redirect }) => {
  const [user, loading, error] = useAuthState(auth);

  //check if user is null when auth is ready
  if ((user === null || user === undefined) && !loading) {
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
