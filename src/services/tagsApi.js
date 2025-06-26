// api/wordsApi.js o api/tagsApi.js

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Firestore } from "../firebase/config";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Tag"],
  endpoints: (builder) => ({
    getTags: builder.query({
      async queryFn(_, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = collection(Firestore, `users/${uid}/tags`);
          const snapshot = await getDocs(ref);
          const tags = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { data: tags };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Tag"],
    }),

    addTag: builder.mutation({
      async queryFn(tag, { getState }) {
        try {
          const { uid } = getState().auth;
          const tagsRef = collection(Firestore, `users/${uid}/tags`);
          const q = query(tagsRef, where("name", "==", tag.name)); // ✅ usar tag.name
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            await addDoc(tagsRef, { name: tag.name, color: tag.color }); // ✅ guardar correctamente
            return { data: { success: true } };
          }

          return { data: { success: false, message: "Tag already exists" } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Tag"],
    }),

    updateTag: builder.mutation({
      async queryFn({ id, name, color }, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/tags/${id}`);
          await updateDoc(ref, { name, color });
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Tag"],
    }),

    deleteTag: builder.mutation({
      async queryFn(id, { getState }) {
        try {
          const { uid } = getState().auth;
          const ref = doc(Firestore, `users/${uid}/tags/${id}`);
          await deleteDoc(ref);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useAddTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
} = tagsApi;
