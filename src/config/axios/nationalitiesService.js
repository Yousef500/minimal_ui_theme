import axios from "axios";
import i18n from "config/i18n";
import { store } from "redux/store";

const nats = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

nats.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize, filterBy } = state.nationalities;
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

const nationalitiesService = {
    getAll: () => nats.get("/Nationalities/GetLookUpNationalities"),
    searchNats: (data) => nats.post("/Nationalities/Search", data),
    addNat: (data) => nats.post("/Nationalities/Add", data),
    editNat: (data) => nats.post("/Nationalities/Edit", data),
    deleteNat: (id) => nats.post(`/Nationalities/Delete?id=${id}`),
};

export default nationalitiesService;
