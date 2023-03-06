import React, { useEffect } from "react";
import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { IconButton } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../Firebase/firebase";

const SignInButton = () => {
  const navigate = useNavigate();
  const signInWithFirebaseRedirect = async () => {
    await signInWithRedirect(auth, provider);
  };

  const checkRedirect = async () => {
    const result = await getRedirectResult(auth);
    if (result) {
      navigate("/");
    }
  };

  useEffect(() => checkRedirect, []);

  return (
    <IconButton xs onClick={signInWithFirebaseRedirect}>
      <GoogleIcon />
    </IconButton>
  );
};

export default SignInButton;
