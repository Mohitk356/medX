import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoginOpen: false,
};

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isLoginOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginOpen = false;
    },
  },
});

export const { openLoginModal, closeLoginModal } = loginSlice.actions;
export default loginSlice.reducer;
