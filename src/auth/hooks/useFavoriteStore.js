import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import {
  addFavoriteWord,
  addFavoritePhrase,
  addFavoriteAnswer,
  removeFavoriteWord,
  removeFavoritePhrase,
  removeFavoriteAnswer,
} from "../../store/slices/translatorSlice";
import { Firestore } from "../../firebase/config";

export const useFavoriteStore = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.auth);

  const favoritesCollection = (type) =>
    collection(Firestore, `users/${uid}/favorites_${type}`);

  // ✅ Agregar favorito
  const saveFavorite = async (type, data) => {
    try {
      await addDoc(favoritesCollection(type), {
        value: data,
        createdAt: new Date(),
      });

      switch (type) {
        case "words":
          dispatch(addFavoriteWord(data));
          break;
        case "phrases":
          dispatch(addFavoritePhrase(data));
          break;
        case "answers":
          dispatch(addFavoriteAnswer(data));
          break;
      }
    } catch (error) {
      console.error("Error al guardar favorito", error);
    }
  };

  // ✅ Cargar favoritos al iniciar sesión
  const loadFavorites = async () => {
    try {
      const [wordsSnap, phrasesSnap, answersSnap] = await Promise.all([
        getDocs(favoritesCollection("words")),
        getDocs(favoritesCollection("phrases")),
        getDocs(favoritesCollection("answers")),
      ]);

      wordsSnap.forEach((doc) => dispatch(addFavoriteWord(doc.data().value)));
      phrasesSnap.forEach((doc) =>
        dispatch(addFavoritePhrase(doc.data().value))
      );
      answersSnap.forEach((doc) =>
        dispatch(addFavoriteAnswer(doc.data().value))
      );
    } catch (error) {
      console.error("Error cargando favoritos", error);
    }
  };

  // ✅ Eliminar favorito
  const deleteFavorite = async (type, value) => {
    try {
      const favRef = favoritesCollection(type);
      const q = query(favRef, where("value", "==", value));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (d) => {
        await deleteDoc(doc(favRef, d.id));
      });

      switch (type) {
        case "words":
          dispatch(removeFavoriteWord(value));
          break;
        case "phrases":
          dispatch(removeFavoritePhrase(value));
          break;
        case "answers":
          dispatch(removeFavoriteAnswer(value));
          break;
      }
    } catch (error) {
      console.error("Error eliminando favorito", error);
    }
  };

  return {
    saveFavorite,
    loadFavorites,
    deleteFavorite,
  };
};
