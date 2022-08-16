import axios from "axios";
import i18n from "config/i18n";
import { store } from "redux/store";

const permissions = axios.create({
    baseURL: "http://iscope.asyadcapital.com:2101/api",
});

permissions.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const authToken = state.currentUser.userInfo.Token;
        config.headers.Authorization = `bearer ${authToken}`;
        config.headers["Accept-Language"] = i18n.language;
        return config;
    },
    (err) => Promise.reject(err)
);

const permissionsService = {
    getMainRoles: () => permissions.get("/Roles/GetLookupSecurityRolesByParentId"),
    getSubRoles: (id) =>
        permissions.get(`/Roles/GetLookupSecurityRolesByParentId?parentRoleId=${id}`),
    getModules: () => permissions.get("/Modules/GetLookupSecurityModules"),
    getPages: (id) =>
        permissions.get(`/Pages/GetLookupSecurityPagesByModuleId?securityModuleId=${id}`),
    getPermissions: ({ pageId, roleId }) =>
        permissions.get(`/Actions/GetLookupPageActionsByRole?pageId=${pageId}&roleId=${roleId}`),
    addPermissions: (data) => permissions.post("/Roles/SaveRolePageActions", data),
};

export default permissionsService;
