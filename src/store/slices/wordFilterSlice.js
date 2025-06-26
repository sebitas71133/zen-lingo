import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchText: "",
  type: "",
  selectedTags: [],
  onlyLearned: false,
};

const wordFilterSlice = createSlice({
  name: "wordFilter",
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
    setOnlyLearned: (state, action) => {
      state.onlyLearned = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearchText,
  setType,
  setSelectedTags,
  setOnlyLearned,
  resetFilters,
} = wordFilterSlice.actions;

export const wordFilterReducer = wordFilterSlice.reducer;
