import axios from "axios";
import i18n from "config/i18n";
import { store } from "redux/store";

const users = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

users.interceptors.request.use(
    (config) => {
        if (config.url.includes("GetLogin")) return config;
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize, filterBy } = state.users;
            const data = {
                ...config.data,
                filterBy,
                page,
                pageSize,
            };
            console.log("config", config);
            config.data = data;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

const usersService = {
    login: ({ username, password }) =>
        users.get(`/Users/GetLogin?username=${username}&password=${password}`),
    searchUsers: (data) => users.post("/Users/Search", data),
    resetPass: (data) => users.post("/Users/ResetUserPassword", data),
    editUser: (data) => users.post("/Users/Edit", data),
    getJobs: () => users.get("/UserJobs/GetLookUpUserJobs"),
    getAllUsersRoles: () => users.get("/Roles/GetLookUpSecurityRoles"),
    getUsersByJobId: (id) => users.get(`/Users/GetLookUpUsersByJobId?securityUserJobId=${id}`),
    addUser: (data) => users.post("/Users/Add", data),
    changeStatus: ({ userId, status }) =>
        users.post(`/Users/ChangeActivityStatus?userId=${userId}&isActive=${status}`),
    resetPassword: (data) => users.post("/Users/ResetUserPassword", data),
};

export default usersService;
