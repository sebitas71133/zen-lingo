import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  words: [],
  isLoading: false,
  error: null,
};

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    setWords: (state, action) => {
      state.words = action.payload;
    },
    addWord: (state, action) => {
      state.words.push(action.payload);
    },
    removeWord: (state, action) => {
      state.words = state.words.filter((word) => word.id !== action.payload);
    },
    updateWord: (state, action) => {
      const index = state.words.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.words[index] = {
          ...state.words[index],
          ...action.payload,
        };
      }
    },
    toggleLearned: (state, action) => {
      const wordId = action.payload;
      const word = state.words.find((w) => w.id === wordId);
      if (word) {
        word.learned = !word.learned;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWords,
  addWord,
  removeWord,
  toggleLearned,
  updateWord,
  setLoading,
  setError,
} = wordSlice.actions;

export const wordReducer = wordSlice.reducer;
