import { configureStore } from "@reduxjs/toolkit";
import  crudApi  from "./api/crudApi";
import authApi from "./api/authApi";



export const store = configureStore({
    reducer: {
        [crudApi.reducerPath]: crudApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(crudApi.middleware, authApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;