import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
    name: "currentUser",
    initialState: {
        modules: [],
        userInfo: {},
        accessibleModules: [],
    },
    reducers: {
        setCurrentUser: (state, action) => {
            const { Modules, User, accessibleModules } = action.payload;
            state.modules = Modules;
            state.userInfo = User;
            state.accessibleModules = accessibleModules;
        },
    },
});

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
