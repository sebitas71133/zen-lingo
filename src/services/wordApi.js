import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Firestore } from "../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const wordApi = createApi({
  reducerPath: "wordApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Words"],

  endpoints: (builder) => ({
    getWords: builder.query({
      async queryFn(_arg, { getState }) {
        const { uid } = getState().auth;
        try {
          const snapshot = await getDocs(
            collection(Firestore, `users/${uid}/words`)
          );
          const words = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: words };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Words"],
      keepUnusedDataFor: 600, // 10 minutos
    }),

    addWord: builder.mutation({
      async queryFn(wordData, { getState }) {
        const { uid } = getState().auth;
        try {
          const ref = await addDoc(
            collection(Firestore, `users/${uid}/words`),
            {
              ...wordData,
              isLearned: false,
              isFavorite: false,
            }
          );
          return { data: { id: ref.id, ...wordData, isLearned: false } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Words"],
    }),

    deleteWord: builder.mutation({
      async queryFn(id, { getState }) {
        const { uid } = getState().auth;
        console.log({ uid });
        try {
          await deleteDoc(doc(Firestore, `users/${uid}/words/${id}`));
          return { data: id };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Words"],
    }),

    updateWord: builder.mutation({
      async queryFn({ id, updatedData }, { getState }) {
        const { uid } = getState().auth;
        try {
          await updateDoc(
            doc(Firestore, `users/${uid}/words/${id}`),
            updatedData
          );
          return { data: { id, ...updatedData } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Words"],
    }),
  }),
});

export const {
  useGetWordsQuery,
  useAddWordMutation,
  useDeleteWordMutation,
  useUpdateWordMutation,
} = wordApi;
