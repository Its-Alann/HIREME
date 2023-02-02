import { useState } from "react";
import { auth } from "../../Firebase/firebase";

const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);

  const signup = async (email, password, name) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      console.log(res.user);

      if (!res) {
        throw new Error("Sign up error occured");
      }

      await res.user.updateProfile({ name });

      isPending(false);
      setError(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};

export default useSignUp;
