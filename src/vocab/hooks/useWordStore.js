import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import {
  setWords,
  addWord,
  removeWord,
  setLoading,
  setError,
  toggleLearned,
  updateWord,
} from "../../store/slices/wordSlice";
import { Firestore } from "../../firebase/config";

export const useWordStore = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.auth); // Asegúrate de tener auth

  const getUserWordsCollection = () =>
    collection(Firestore, `users/${uid}/words`);

  const loadWords = async () => {
    dispatch(setLoading(true));
    try {
      const snapshot = await getDocs(getUserWordsCollection());
      const words = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setWords(words));
    } catch (error) {
      dispatch(setError("Error al cargar palabras"));
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createWord = async (wordData) => {
    try {
      const ref = await addDoc(getUserWordsCollection(), {
        ...wordData,
        isLearned: false,
      });
      dispatch(addWord({ id: ref.id, ...wordData }));
    } catch (error) {
      dispatch(setError("Error al agregar palabra"));
      console.log(error);
      console.error(error);
    }
  };

  const deleteWordById = async (id) => {
    try {
      await deleteDoc(doc(Firestore, `users/${uid}/words/${id}`));
      dispatch(removeWord(id));
    } catch (error) {
      dispatch(setError("Error al eliminar palabra"));
      console.error(error);
    }
  };

  const toggleLearnedStatus = async (id, currentValue) => {
    try {
      const ref = doc(Firestore, `users/${uid}/words/${id}`);
      await updateDoc(ref, { isLearned: !currentValue });
      dispatch(toggleLearned(id));
    } catch (error) {
      dispatch(setError("Error al cambiar estado aprendido"));
      console.error(error);
    }
  };

  const updateWordById = async (id, updatedData) => {
    try {
      const ref = doc(Firestore, `users/${uid}/words/${id}`);
      await updateDoc(ref, updatedData);
      dispatch(updateWord({ id, ...updatedData }));
    } catch (error) {
      dispatch(setError("Error al actualizar palabra"));
      console.error(error);
    }
  };

  return {
    loadWords,
    createWord,
    deleteWordById,
    toggleLearnedStatus,
    updateWordById,
  };
};
