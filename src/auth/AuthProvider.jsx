import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { onAuthStateChanged } from "firebase/auth";

import { FirebaseAuth } from "../firebase/config";
import { CheckingAuth } from "./components/CheckingAuth";
import { checkingCredentials, login, logout } from "../store/slices/authSlice";

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { status, uid } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkingCredentials());

    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(login({ uid, email, displayName, photoURL }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return <>{children}</>;
};
