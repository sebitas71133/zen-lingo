import { useDispatch, useSelector } from "react-redux";

import { Firestore } from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";

import {
  checkingCredentials,
  login,
  logout,
  setIsloading,
} from "../../store/slices/authSlice";
import {
  signInWithGoogle,
  logoutFirebase,
  signInWithEmailPassword,
  registerWithEmailPassword,
} from "../../firebase/providers";

export const useAuthStore = () => {
  const { status, email, displayName, photoUrl, errorMessage } = useSelector(
    (s) => s.auth
  );
  const dispatch = useDispatch();
  const user = { email, displayName, photoUrl };
  const createUserWithEmailPasswordThunk = async ({
    email,
    password,
    name: displayName,
  }) => {
    dispatch(setIsloading(true));
    dispatch(checkingCredentials());

    const result = await registerWithEmailPassword({
      email,
      password,
      displayName,
    });
    if (result.ok) {
      await saveUserToFirestore({ uid: result.uid, email: result.email });
      dispatch(login(result));
    } else {
      dispatch(logout({ errorMessage: result.errorMessage }));
    }
    dispatch(setIsloading(false));
  };

  //INICIAR SESION CON UN EMAIL Y PASSWORD

  const signInWithEmailPassowrdThunk = async ({ email, password }) => {
    dispatch(setIsloading(true));
    dispatch(checkingCredentials());

    const result = await signInWithEmailPassword({ email, password });
    if (result.ok) {
      dispatch(login(result));
    } else {
      dispatch(logout({ errorMessage: result.errorMessage }));
    }
    dispatch(setIsloading(false));
  };

  // const getRegisteredUsers = async () => {
  //   const collectionRef = collection(Firestore, "users");
  //   const docs = await getDocs(collectionRef);
  //   const users = [];

  //   docs.forEach((doc) => {
  //     users.push({ id: doc.id, ...doc.data() });
  //   });

  //   dispatch(setUsers(users));
  // };

  const saveUserToFirestore = async (user) => {
    if (!user) return;

    const userRef = doc(Firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let currentRole = "usuario"; // Rol por defecto

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.role) {
        currentRole = userData.role; // Mantener el rol existente
      }
    }
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        role: currentRole, // Asigna el rol por defecto
      },
      { merge: true }
    );
  };

  // const updateUserRole = async (uid, newRole) => {
  //   if (!uid || !newRole) return;

  //   dispatch(setIsUpdatingRole(true));
  //   const userRef = doc(Firestore, "users", uid);

  //   await setDoc(userRef, { role: newRole }, { merge: true });

  //   dispatch(setIsUpdatingRole(false));
  // };

  const logoutTotal = async () => {
    await logoutFirebase();
    dispatch(logout());
    // dispatch(clearNotesLogout());
  };

  //REGISTRARSE O INICIAR SESION CON GOOGLE

  const checkingAuthenticaction = async () => {
    dispatch(setIsloading(true));
    dispatch(checkingCredentials());

    const result = await signInWithGoogle();
    if (result.ok) {
      await saveUserToFirestore({ uid: result.uid, email: result.email });
      dispatch(login(result));
    } else {
      dispatch(logout({ errorMessage: result.errorMessage }));
    }
    dispatch(setIsloading(false));
  };

  return {
    user,
    // getRegisteredUsers,
    signInWithEmailPassowrdThunk,
    createUserWithEmailPasswordThunk,
    logoutTotal,
    checkingAuthenticaction,
    //updateUserRole,
  };
};
