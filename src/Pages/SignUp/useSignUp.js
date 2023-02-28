//Author: ?

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import useAuthContext from "../../context/useAuthContext";

const useSignUp = () => {
  const [error, setError] = useState(undefined);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, name) => {
    setError(undefined);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res.user);

      if (!res) {
        throw new Error("Sign up error occured");
      }

      if (auth.currentUser != null) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      } else {
        throw Error("current user authentification error");
      }
      dispatch({ type: "LOGIN", payload: res.user });

      setIsPending(false);
      setError(undefined);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};

export default useSignUp;
