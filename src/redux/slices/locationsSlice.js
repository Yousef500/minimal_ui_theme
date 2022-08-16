import { createSlice } from "@reduxjs/toolkit";

const locationsSlice = createSlice({
    name: "locations",
    initialState: {
        allLocations: [],
        locations: [],
        loadingLocations: true,
        page: 1,
        pageSize: 10,
        pageCount: 0,
        filters: {
            name: "",
            description: "",
        },
    },
    reducers: {
        setAllLocations: (state, action) => {
            state.allLocations = action.payload;
        },
        setLocations: (state, action) => {
            const { PagedList, PageCount } = action.payload;
            state.locations = PagedList;
            state.pageCount = PageCount;
            state.loadingLocations = false;
        },
        setLoadingLocations: (state, action) => {
            state.loadingLocations = action.payload;
        },
        setLocationsPageNo: (state, action) => {
            state.page = action.payload;
        },
        setLocationsFilters: (state, action) => {
            state.filters = action.payload;
        },
        resetLocationsFilters: (state) => {
            state.filters = { name: "", description: "" };
        },
        deleteLocationFilter: (state, action) => {
            state.filters[action.payload] = "";
        },
    },
});

export const {
    setAllLocations,
    setLocations,
    setLoadingLocations,
    setLocationsPageNo,
    setLocationsFilters,
    resetLocationsFilters,
    deleteLocationFilter,
} = locationsSlice.actions;

export default locationsSlice.reducer;
