import { useEffect, useState } from "react";
import { auth } from "../Firebase/firebase";
import useAuthContext from "./useAuthContext";

const useLogout = () => {
  const [cancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // sign the user out
      await auth.signOut();

      // dispatch logout action
      dispatch({ type: "LOGOUT" });

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

  return { logout, error, isPending };
};

export default useLogout;
