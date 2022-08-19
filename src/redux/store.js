// import { configureStore } from '@reduxjs/toolkit';
// import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
// import { persistStore, persistReducer } from 'redux-persist';
// import { rootPersistConfig, rootReducer } from './rootReducer';

// // ----------------------------------------------------------------------

// const store = configureStore({
//   reducer: persistReducer(rootPersistConfig, rootReducer),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//       immutableCheck: false,
//     }),
// });

// const persistor = persistStore(store);

// const { dispatch } = store;

// const useSelector = useAppSelector;

// const useDispatch = () => useAppDispatch();

// export { store, persistor, dispatch, useSelector, useDispatch };

import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import persistCombineReducers from 'redux-persist/es/persistCombineReducers';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import cemeteriesReducer from './slices/cemeteriesSlice';
import currentUserReducer from './slices/currentUserSlice';
import deadReducer from './slices/deadSlice';
import gendersReducer from './slices/gendersSlice';
import locationsReducer from './slices/locationsSlice';
import nationalitiesReducer from './slices/nationalitiesSlice';
import shiftsReducer from './slices/shiftsSlice';
import shiftTimesReducer from './slices/shiftTimesSlice';
import sidenavReducer from './slices/sidenavSlice';
import usersReducer from './slices/usersSlice';

const reducers = {
    sidenav: sidenavReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
    dead: deadReducer,
    nationalities: nationalitiesReducer,
    genders: gendersReducer,
    cemeteries: cemeteriesReducer,
    locations: locationsReducer,
    shifts: shiftsReducer,
    shiftTimes: shiftTimesReducer,
};

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['currentUser'],
};

const persistedReducer = persistCombineReducers(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});

export const persistor = persistStore(store);
