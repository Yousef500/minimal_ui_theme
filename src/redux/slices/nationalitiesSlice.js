import { createSlice } from "@reduxjs/toolkit";

const nationalitiesSlice = createSlice({
    name: "nationalities",
    initialState: {
        allNats: [],
        nationalities: [],
        page: 1,
        pageSize: 10,
        pageCount: 0,
        natsLoading: true,
        filterBy: "",
    },
    reducers: {
        setAllNats: (state, action) => {
            state.allNats = action.payload;
        },
        setNationalities: (state, action) => {
            const { PageCount, PagedList } = action.payload;
            state.nationalities = PagedList;
            state.natsLoading = false;
            state.pageCount = PageCount;
        },
        setNatsPageNo: (state, action) => {
            state.page = action.payload;
        },
        setNatsLoading: (state, action) => {
            state.natsLoading = action.payload;
        },
        setNatsFilterBy: (state, action) => {
            state.filterBy = action.payload;
        },
    },
});

export const { setAllNats, setNationalities, setNatsLoading, setNatsPageNo, setNatsFilterBy } =
    nationalitiesSlice.actions;

export default nationalitiesSlice.reducer;
