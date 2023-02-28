import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import useAuthContext from "./useAuthContext";

const useLogin = () => {
  const [cancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // sign the user out
      const res = await signInWithEmailAndPassword(auth, email, password);

      // dispatch logout action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!cancelled) {
        setIsPending(false);
      }

      // update state
      setIsPending(false);
      setError(null);
    } catch (err) {
      if (!cancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => () => setIsCancelled(true), []);

  return { login, error, isPending };
};

export default useLogin;
