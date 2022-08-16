import { createSlice } from "@reduxjs/toolkit";

const gendersSlice = createSlice({
    name: "genders",
    initialState: {
        allGenders: [],
    },
    reducers: {
        setAllGenders: (state, action) => {
            state.allGenders = action.payload;
        },
    },
});

export const { setAllGenders } = gendersSlice.actions;

export default gendersSlice.reducer;
