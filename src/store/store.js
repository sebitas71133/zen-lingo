import { configureStore } from "@reduxjs/toolkit";

import { themeReducer } from "./slices/themeSlice";
import { authReducer } from "./slices/authSlice";

import { wordApi } from "../services/wordApi";
import { tagsApi } from "../services/tagsApi";

import { uiReducer } from "./slices/uiSlice";
import { phrasesApi } from "../services/phrasesApi";
import { verbsApi } from "../services/verbsApi";
import { textsApi } from "../services/textsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    [wordApi.reducerPath]: wordApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [phrasesApi.reducerPath]: phrasesApi.reducer,
    [verbsApi.reducerPath]: verbsApi.reducer,
    [textsApi.reducerPath]: textsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      wordApi.middleware,
      tagsApi.middleware,
      phrasesApi.middleware,
      verbsApi.middleware,
      textsApi.middleware,
    ]),
});
