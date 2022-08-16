import { createSlice } from "@reduxjs/toolkit";

const cemeteriesSlice = createSlice({
    name: "cemeteries",
    initialState: {
        allCemeteries: [],
        cemeteries: [],
        cemeteriesLoading: true,
        orderby: 1,
        page: 1,
        pageSize: 10,
        pageCount: 1,
    },
    reducers: {
        setAllCemeteries: (state, action) => {
            state.allCemeteries = action.payload;
        },
        setCemeteries: (state, action) => {
            state.cemeteries = action.payload.PagedList;
            state.pageCount = action.payload.PageCount;
            state.cemeteriesLoading = false;
        },
        setCemeteriesPageNo: (state, action) => {
            state.page = action.payload;
            state.cemeteriesLoading = true;
        },
        setCemeteriesLoading: (state, action) => {
            state.cemeteriesLoading = action.payload;
        },
    },
});

export const { setAllCemeteries, setCemeteries, setCemeteriesPageNo, setCemeteriesLoading } = cemeteriesSlice.actions;

export default cemeteriesSlice.reducer;
