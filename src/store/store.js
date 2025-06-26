import { configureStore } from "@reduxjs/toolkit";
import { translatorReducer } from "./slices/translatorSlice";
import { themeReducer } from "./slices/themeSlice";
import { authReducer } from "./slices/authSlice";
import { usersReducer } from "./slices/userSlice";
import { wordReducer } from "./slices/wordSlice";
import { tagReducer } from "./slices/tagSlice";
import { wordApi } from "../services/wordApi";
import { tagsApi } from "../services/tagsApi";
import { wordFilterReducer } from "./slices/wordFilterSlice";
import { uiReducer } from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: usersReducer,
    translator: translatorReducer,
    theme: themeReducer,
    word: wordReducer,
    tags: tagReducer,
    wordFilter: wordFilterReducer,
    ui: uiReducer,
    [wordApi.reducerPath]: wordApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([wordApi.middleware, tagsApi.middleware]),
});
