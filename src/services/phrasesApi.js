// services/phrasesApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Firestore } from "../firebase/config";

export const phrasesApi = createApi({
  reducerPath: "phrasesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Phrase"],
  endpoints: (builder) => ({
    getPhrases: builder.query({
      async queryFn(_, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/phrases`);
          const snapshot = await getDocs(ref);
          const phrases = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: phrases };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Phrase"],
      keepUnusedDataFor: 1800, // 30 minutos
    }),

    addPhrase: builder.mutation({
      async queryFn(phrase, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/phrases`);
          await addDoc(ref, {
            ...phrase,
            isLearned: false,
            isFavorite: false,
          });
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Phrase"],
    }),

    updatePhrase: builder.mutation({
      async queryFn({ id, ...data }, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/phrases/${id}`);
          await updateDoc(ref, data);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Phrase"],
    }),

    deletePhrase: builder.mutation({
      async queryFn(id, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/phrases/${id}`);
          await deleteDoc(ref);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Phrase"],
    }),
  }),
});

export const {
  useGetPhrasesQuery,
  useAddPhraseMutation,
  useUpdatePhraseMutation,
  useDeletePhraseMutation,
} = phrasesApi;
