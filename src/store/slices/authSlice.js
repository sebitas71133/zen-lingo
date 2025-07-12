import { createSlice } from "@reduxjs/toolkit";

//REGISTRARSE O INICIAR SESION CON GOOGLE

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking",
    uid: null,
    email: null,
    displayName: null || "Anónimo",
    photoUrl: null,
    errorMessage: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.status = "authenticated";
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoUrl = action.payload.photoUrl;
      state.errorMessage = null;
    },
    logout: (state, action) => {
      state.status = "not-authenticated";
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoUrl = null;
      state.errorMessage = action.payload?.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
    setIsloading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = null;
    },
  },
});

export const {
  checkingCredentials,
  login,
  logout,
  setIsloading,
  clearErrorMessage,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
