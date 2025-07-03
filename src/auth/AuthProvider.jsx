import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { onAuthStateChanged } from "firebase/auth";

import { useAuthStore } from "./hooks/useAuthStore";
import { FirebaseAuth } from "../firebase/config";
import { CheckingAuth } from "./components/CheckingAuth";
import { checkingCredentials, login, logout } from "../store/slices/authSlice";

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { status, uid } = useSelector((state) => state.auth);
  const { users, userRole } = useSelector((state) => state.user); // Obtiene los usuarios registrados

  const { updateRoleUser } = useAuthStore();

  useEffect(() => {
    dispatch(checkingCredentials());

    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(login({ uid, email, displayName, photoURL }));

        // dispatch(updateRoleUser());
        // dispatch(getRegisteredUsers()); // Cargar usuarios registrados
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   if (users.length > 0 && uid) {
  //     dispatch(updateRoleUser(uid));
  //   }
  // }, [users, uid]);

  // useEffect(() => {
  //   if (userRole === "admin") {
  //     dispatch(fetchAllFirestoreImages()); // Obtener referencias de imágenes
  //     dispatch(getCloudinaryImagesThunk()); // Obtener imágenes de Cloudinary
  //   }
  // }, [userRole]);

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return <>{children}</>;
};
