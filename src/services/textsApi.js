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

export const textsApi = createApi({
  reducerPath: "textsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Text"],
  endpoints: (builder) => ({
    getTexts: builder.query({
      async queryFn(_, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/texts`);
          const snapshot = await getDocs(ref);
          const texts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: texts };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Text"],
      keepUnusedDataFor: 1800, // 30 minutos
    }),

    addText: builder.mutation({
      async queryFn(text, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/texts`);
          await addDoc(ref, text);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Text"],
    }),

    updateText: builder.mutation({
      async queryFn({ id, ...data }, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/texts/${id}`);
          await updateDoc(ref, data);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Text"],
    }),

    deleteText: builder.mutation({
      async queryFn(id, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/texts/${id}`);
          await deleteDoc(ref);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Text"],
    }),
  }),
});

export const {
  useGetTextsQuery,
  useAddTextMutation,
  useUpdateTextMutation,
  useDeleteTextMutation,
} = textsApi;
