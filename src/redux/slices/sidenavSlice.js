import { createSlice } from "@reduxjs/toolkit";

const sidenavSlice = createSlice({
    name: "sidenav",
    initialState: {
        open: false,
    },
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload;
        },
    },
});

export const {setOpen} = sidenavSlice.actions;

export default sidenavSlice.reducer;
