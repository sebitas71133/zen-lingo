import { createSlice } from "@reduxjs/toolkit";

const translatorSlice = createSlice({
  name: "translator",
  initialState: {
    // inputText: "",
    translatedText: "",

    generatedAnswer: "",
    favoriteWords: [],
    favoritePhrases: [],
    favoriteAnswers: [],
    isLoading: false,
    isSuccess: false,
    idiomatic: false,
  },
  reducers: {
    setTranslatedText: (state, action) => {
      state.translatedText = action.payload;
      state.isSuccess = true;
    },

    setGeneratedAnswer: (state, action) => {
      state.generatedAnswer = action.payload;
      state.isSuccess = true;
    },
    addFavoriteWord: (state, action) => {
      if (!state.favoriteWords.includes(action.payload)) {
        state.favoriteWords.push(action.payload);
      }
    },
    addFavoritePhrase: (state, action) => {
      if (!state.favoritePhrases.includes(action.payload)) {
        state.favoritePhrases.push(action.payload);
      }
    },
    addFavoriteAnswer: (state, action) => {
      if (!state.favoriteAnswers.includes(action.payload)) {
        state.favoriteAnswers.push(action.payload);
      }
    },
    removeFavoriteWord: (state, action) => {
      state.favoriteWords = state.favoriteWords.filter(
        (word) => word !== action.payload
      );
    },
    removeFavoritePhrase: (state, action) => {
      state.favoritePhrases = state.favoritePhrases.filter(
        (phrase) => phrase !== action.payload
      );
    },
    removeFavoriteAnswer: (state, action) => {
      state.favoriteAnswers = state.favoriteAnswers.filter(
        (answer) => answer !== action.payload
      );
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
    setUseIdiomatic: (state, action) => {
      state.idiomatic = action.payload;
    },
  },
});

export const translatorReducer = translatorSlice.reducer;
export const {
  addFavoriteAnswer,
  addFavoritePhrase,
  addFavoriteWord,
  removeFavoriteAnswer,
  removeFavoritePhrase,
  removeFavoriteWord,
  setGeneratedAnswer,
  setDarkMode,
  setIsLoading,
  setIsSuccess,
  setTranslatedText,
  setUseIdiomatic,
} = translatorSlice.actions;
