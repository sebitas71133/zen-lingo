import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchText: "",
  type: "",
  selectedTags: [],
  onlyLearned: false,
  onlyFavorite: false,
  sortBy: "alphabetical", // 'none' | 'alphabetical' | 'createdAt' | etc
  sortOrder: "asc", // 'asc' | 'desc'
  itemsPerPage: 6,
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
    setOnlyFavorite: (state, action) => {
      state.onlyFavorite = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setItemPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },

    resetFilters: () => initialState,
  },
});

export const {
  setSearchText,
  setType,
  setSelectedTags,
  setOnlyLearned,
  setOnlyFavorite,
  resetFilters,
  setSortBy,
  setSortOrder,
  setItemPerPage,
} = wordFilterSlice.actions;

export const wordFilterReducer = wordFilterSlice.reducer;
