import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://choretrolley-apiservice-production.up.railway.app',
    prepareHeaders: (headers) => {
      // const users = localStorage.getItem('user');
      const token = sessionStorage.getItem('accessToken');

      if (token) {
        headers.set('Authorization', `bearer ${token}`);
      }

      return headers;
    }, }),
  endpoints: (builder) => ({
    verifyOrder: builder.query<any, string>({
      query: (reference) => `/order/verify/${reference}`,
    }),
  }),
});

export const { useVerifyOrderQuery } = orderApi;
