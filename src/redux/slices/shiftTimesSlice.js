import { createSlice } from '@reduxjs/toolkit';

const shiftTimesSlice = createSlice({
    name: 'shiftTimes',
    initialState: {
        shiftTimes: [],
        page: 1,
        pageSize: 10,
        pageCount: 0,
        filterBy: '',
        loadingShiftTimes: true,
    },
    reducers: {
        setShiftTimes: (state, action) => {
            state.shiftTimes = action.payload.PagedList || [];
            state.pageCount = action.payload.PageCount || 0;
            state.loadingShiftTimes = false;
        },

        setShiftTimesPageNo: (state, action) => {
            state.page = action.payload;
        },

        setLoadingShiftTimes: (state, action) => {
            state.loadingShiftTimes = action.payload;
        },
    },
});

export const { setShiftTimes, setShiftTimesPageNo, setLoadingShiftTimes } = shiftTimesSlice.actions;

export default shiftTimesSlice.reducer;
