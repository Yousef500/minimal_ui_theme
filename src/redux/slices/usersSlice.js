import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        filterBy: "",
        page: 1,
        pageSize: 10,
        pageCount: 0,
        usersLoading: true,
    },
    reducers: {
        setUsers: (state, action) => {
            const { PagedList, PageCount } = action.payload;
            state.users = PagedList;
            state.pageCount = PageCount;
            state.usersLoading = false;
        },
        setUsersPageNo: (state, action) => {
            state.page = action.payload;
            state.usersLoading = true;
        },
        setUsersLoading: (state, action) => {
            state.usersLoading = action.payload;
        },
        setUsersFilterBy: (state, action) => {
            state.filterBy = action.payload;
        },
        resetUsersFilters: (state) => {
            state.filterBy = "";
        },
    },
});

export const { setUsers, setUsersPageNo, setUsersLoading, setUsersFilterBy, resetUsersFilters } = usersSlice.actions;

export default usersSlice.reducer;
