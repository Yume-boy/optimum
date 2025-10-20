import { configureStore } from "@reduxjs/toolkit";
import  crudApi  from "./api/crudApi";
import authApi from "./api/authApi";
import { paymentApi } from "./api/paymentApi";
import { orderApi } from "./api/orderApi";


export const store = configureStore({
    reducer: {
        [crudApi.reducerPath]: crudApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer
    },

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(crudApi.middleware, authApi.middleware, paymentApi.middleware, orderApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;