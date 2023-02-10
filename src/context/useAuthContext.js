import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext outside of its provider");
  }

  return context;
};

export default useAuthContext;
