import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    currRate: 1,
    currency: "AED"
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        setExRate: (state, action) => {
            state.currRate = action.payload;
        },
        setCurrency: (state, action) => {
            state.currency = action.payload;
        }
    },
});

export const { setExRate, setCurrency } = appSlice.actions;
export default appSlice.reducer;
