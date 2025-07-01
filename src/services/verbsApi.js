// services/verbsApi.js
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

export const verbsApi = createApi({
  reducerPath: "verbsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Verb"],
  endpoints: (builder) => ({
    getVerbs: builder.query({
      async queryFn(_, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/verbs`);
          const snapshot = await getDocs(ref);
          const verbs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: verbs };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Verb"],
    }),

    addVerb: builder.mutation({
      async queryFn(verb, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/verbs`);
          await addDoc(ref, verb);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Verb"],
    }),

    updateVerb: builder.mutation({
      async queryFn({ id, ...data }, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/verbs/${id}`);
          await updateDoc(ref, data);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Verb"],
    }),

    deleteVerb: builder.mutation({
      async queryFn(id, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/verbs/${id}`);
          await deleteDoc(ref);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Verb"],
    }),
  }),
});

export const {
  useGetVerbsQuery,
  useAddVerbMutation,
  useUpdateVerbMutation,
  useDeleteVerbMutation,
} = verbsApi;
