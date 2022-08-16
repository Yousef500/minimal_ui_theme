import axios from 'axios';
import i18n from '../../locales/i18n';
import { store } from '../../redux/store';

const locations = axios.create({
  baseURL: 'http://iscope.asyadcapital.com:2101/api',
});

locations.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const authToken = state.currentUser.userInfo.Token;
    config.headers.Authorization = `bearer ${authToken}`;
    config.headers['Accept-Language'] = i18n.language;
    if (config.url.includes('/GuardSites/Search')) {
      const { page, pageSize, filterBy, filters } = state.locations;
      const data = {
        ...config.data,
        filterBy,
        page,
        pageSize,
        ...filters,
      };
      console.log('config', config);
      config.data = data;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// const getLocationAndShifts = async (id) => {
//     const location = `/GuardSites/Get?id=${id}`;
//     const
//     Promise.all()
// }

const locationsService = {
  getAll: () => locations.get('/GuardSites/GetLookUpGuardSite'),
  searchLocations: (data) => locations.post('/GuardSites/Search', data),
  addLocation: (data) => locations.post('/GuardSites/Add', data),
  editLocation: (data) => locations.post('/GuardSites/Edit', data),
  deleteLocation: (id) => locations.post(`/GuardSites/Delete?id=${id}`),
  getLocation: (id) => locations.get(`/GuardSites/Get?id=${id}`),
  getShifts: (id) => locations.post('/GuardSiteDailyWorkShifts/Search', { sGsGuardSiteId: id }),
  // getLocationAndShifts: (id) => Promise.all([this.getLocation(id), this.getShifts(id)]),
};

export const getLocationAndShifts = (id) => {
  return Promise.all([locationsService.getLocation(id), locationsService.getShifts(id)]);
};

export default locationsService;
