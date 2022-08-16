import { createSlice } from "@reduxjs/toolkit";

const shiftsSlice = createSlice({
    name: "shifts",
    initialState: {
        shifts: [],
        loadingShifts: true,
    },
    reducers: {
        setShifts: (state, action) => {
            state.shifts = action.payload[0];
            state.loadingShifts = false;
        },
        setLoadingShifts: (state, action) => {
            state.loadingShifts = action.payload;
        },
    },
});

export const { setShifts, setLoadingShifts } = shiftsSlice.actions;
export default shiftsSlice.reducer;
