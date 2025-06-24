import { createSlice } from "@reduxjs/toolkit";

const tagSlice = createSlice({
  name: "tags",
  initialState: {
    list: [],
  },
  reducers: {
    setTags: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setTags } = tagSlice.actions;
export const tagReducer = tagSlice.reducer;
