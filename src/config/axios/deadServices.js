import axios from "axios";
import i18n from "config/i18n";
import { store } from "redux/store";

const dead = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

dead.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize, filterBy, filters } = state.dead;
            const data = {
                ...config.data,
                ...filters,
                sortBy: filters.sortBy ? filters.sortBy.value : null,
                orderby: filters.orderby?.length ? Number(filters.orderby) : 1,
                filterBy,
                page,
                pageSize,
            };
            console.log("config.data", data);
            config.data = data;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

const deadService = {
    searchDead: (data) => dead.post("/HonorTheDead/Search", data),
    editDead: (data) => dead.post("/HonorTheDead/Edit", data),
    addDead: (data) => dead.post("/HonorTheDead/Add", data),
    removeRecord: (id) => dead.post(`/HonorTheDead/Delete?id=${id}`),
    changeSatus: (id, status) =>
        dead.post(`HonorTheDead/ChangeActivityStatus?deadId=${id}&isActive=${status}`),
};

export default deadService;
