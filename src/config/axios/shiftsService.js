import axios from "axios";
import i18n from "src/locales/i18n";
import { store } from "src/redux/store";

const shifts = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

shifts.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        if (config.url.includes("Search")) {
            const { page, pageSize } = state.shifts;
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

const shiftsService = {
    getShiftsByDay: (id) => shifts.get(`/GuardSiteDailyWorkShifts/FindByDayId?lookupDayId=${id}`),
    addShift: (data) => shifts.post("/GuardSiteDailyWorkShifts/Add", data),
    editShift: (data) => shifts.post("/GuardSiteDailyWorkShifts/Edit", data),
    deleteShift: (id) => shifts.post(`/GuardSiteDailyWorkShifts/Delete?id=${id}`),
};

export default shiftsService;
