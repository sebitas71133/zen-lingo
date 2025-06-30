import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dialogs: {
    wordForm: false,
    wordEditForm: false,
    wordShowForm: false,
    phraseForm: false,
    phraseEditForm: false,
    deleteConfirm: false,
    // puedes agregar más si es necesario
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDialog: (state, action) => {
      const dialogName = action.payload;
      state.dialogs[dialogName] = true;
    },
    closeDialog: (state, action) => {
      const dialogName = action.payload;
      state.dialogs[dialogName] = false;
    },
    toggleDialog: (state, action) => {
      const dialogName = action.payload;
      state.dialogs[dialogName] = !state.dialogs[dialogName];
    },
  },
});

export const { openDialog, closeDialog, toggleDialog } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
