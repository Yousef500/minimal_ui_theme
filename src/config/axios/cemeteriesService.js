import axios from "axios";
import i18n from "src/locales/i18n";
import { store } from "src/redux/store";

const cemeteries = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

cemeteries.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize, filterBy, orderby } = state.cemeteries;
            const data = {
                ...config.data,
                orderby,
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

const cemeteriesService = {
    getAll: () => cemeteries.get("/Cemeteries/GetLookUpCemetries"),
    searchCemeteries: (data) => cemeteries.post("/Cemeteries/Search", data),
    addCemetery: (data) => cemeteries.post("/Cemeteries/Add", data),
    editCemetery: (data) => cemeteries.post("/Cemeteries/Edit", data),
    deleteCemetery: (id) => cemeteries.post(`/Cemeteries/Delete?id=${id}`),
};

export default cemeteriesService;
