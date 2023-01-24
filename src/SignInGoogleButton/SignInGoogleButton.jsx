import React from "react";
import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { IconButton } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider } from "../Firebase/firebase";

const signInWithFirebaseRedirect = () => {
  getRedirectResult(auth).then((result) => {
    if (!result) {
      signInWithRedirect(auth, provider);
    } else {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      console.log("user", result.user);
    }
  });
};

const SignInButton = () => (
  <IconButton onClick={signInWithFirebaseRedirect}>
    <GoogleIcon />
  </IconButton>
);

export default SignInButton;
