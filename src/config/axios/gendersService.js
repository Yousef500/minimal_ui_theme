import axios from "axios";
import i18n from "config/i18n";
import { store } from "redux/store";

const genders = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

genders.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize, filterBy } = state.genders;
            const data = {
                ...config.data,
                filterBy,
                page,
                pageSize,
            };
            console.log("config.data", config.data);
            config.data = data;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

const gendersService = {
    getAll: () => genders.get("/GenderTypes/GetLookUpGenderTypes"),
};

export default gendersService;
