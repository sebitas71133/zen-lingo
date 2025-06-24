import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

import { setTags } from "../../store/slices/tagSlice";
import { Firestore } from "../../firebase/config";

export const useTagStore = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.auth);

  const getUserTagsCollection = () =>
    collection(Firestore, `users/${uid}/tags`);

  const loadTags = async () => {
    try {
      const snapshot = await getDocs(getUserTagsCollection());
      const tags = snapshot.docs.map((doc) => doc.data().name);
      dispatch(setTags(tags));
    } catch (error) {
      console.error("Error al cargar tags", error);
    }
  };

  const addTagIfNotExists = async (tagName) => {
    const tagsRef = collection(Firestore, `users/${uid}/tags`);
    const q = query(tagsRef, where("name", "==", tagName));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(tagsRef, { name: tagName });
    }
  };

  return {
    loadTags,
    addTagIfNotExists,
  };
};
