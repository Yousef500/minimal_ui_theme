import axios from "axios";
import i18n from "config/i18n";
import { store } from "redux/store";

const shiftTimes = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

shiftTimes.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize } = state.shiftTimes;
            const data = {
                ...config.data,
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

const shiftTimesService = {
    getAll: () => shiftTimes.get("/WorkShifts/GetLookUpWorkShifts"),
    getWorkingDays: () => shiftTimes.get("/WorkShifts/GetWorkingDays"),
};

export default shiftTimesService;
