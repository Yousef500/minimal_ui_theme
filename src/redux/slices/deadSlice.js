import { createSlice } from "@reduxjs/toolkit";

const deadSlice = createSlice({
    name: "dead",
    initialState: {
        dead: [],
        filterBy: "",
        page: 1,
        pageSize: 10,
        pageCount: 0,
        filters: {
            name: null,
            sortBy: null,
            orderby: null,
            nationality: null,
            nationalNumber: null,
            dateOfDeath: null,
            dateOfDeathFrom: null,
            dateOfDeathTO: null,
            isActive: null,
        },

        deadLoading: true,
    },
    reducers: {
        setDead: (state, action) => {
            state.dead = action.payload.PagedList;
            state.pageCount = action.payload.PageCount;
            state.deadLoading = false;
        },
        setDeadFilterBy: (state, action) => {
            state.filterBy = action.payload;
        },
        setDeadPageNo: (state, action) => {
            state.page = action.payload;
            state.deadLoading = true;
        },
        setDeadLoading: (state, action) => {
            state.deadLoading = action.payload;
        },
        setDeadFilters: (state, action) => {
            state.filters.name = action.payload.name;
            state.filters.sortBy = action.payload.sortBy;
            state.filters.orderby = action.payload.orderby;
            state.filters.nationality = action.payload.nationality;
            state.filters.nationalNumber = action.payload.nationalNumber;
            state.filters.dateOfDeath = action.payload.dateOfDeath;
            state.filters.dateOfDeathFrom = action.payload.dateOfDeathFrom;
            state.filters.dateOfDeathTO = action.payload.dateOfDeathTO;
            state.filters.isActive = action.payload.isActive;
        },

        resetDeadFilters: (state) => {
            state.filters.name = null;
            state.filters.sortBy = null;
            state.filters.orderby = 0;
            state.filters.nationality = null;
            state.filters.nationalNumber = null;
            state.filters.dateOfDeath = null;
            state.filters.dateOfDeathFrom = null;
            state.filters.dateOfDeathTO = null;
            state.filters.isActive = null;
        },

        deleteDeadFilter: (state, action) => {
            if (action.payload === "orderby") {
                state.filters.orderby = null;
            } else {
                state.filters[action.payload] = null;
            }
        },
    },
});

export const {
    setDead,
    setDeadLoading,
    setDeadPageNo,
    setDeadFilters,
    resetDeadFilters,
    deleteDeadFilter,
    setDeadFilterBy,
} = deadSlice.actions;

export default deadSlice.reducer;
