import React from "react";
import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth, provider } from "../Firebase/firebase";

const signInWithFirebaseRedirect = () => {
  getRedirectResult(auth).then((result) => {
    if (!result.user) {
      signInWithRedirect(auth, provider);
    } else {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      console.log("user", result.user);
    }
  });
};

const SignIn = () => (
  <button type="button" onClick={signInWithFirebaseRedirect}>
    Sign In with Google
  </button>
);

export default SignIn;
