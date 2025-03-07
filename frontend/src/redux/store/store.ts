import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
const typedStorage = storage as unknown as import("redux-persist").Storage;
export default typedStorage;
import authreducer from "../slice/authSlice";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const presistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authreducer,
});

const presistReducer = persistReducer(presistConfig, rootReducer);

//store

 export const store = configureStore({
  reducer: presistReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const presistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
