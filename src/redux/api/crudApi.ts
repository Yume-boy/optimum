// 'use client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const crudApi = createApi({
  reducerPath: 'crudApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://logistics.coldflamestechnologies.com/api/v1',
    prepareHeaders: (headers) => {
      // const users = localStorage.getItem('user');
      const token = sessionStorage.getItem('token');

      if (token) {
        headers.set('Authorization', `bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchResource: builder.query({
      query: (url) => url,
    }),
    createResource: builder.mutation({
      query: ({ url, data }) => ({
        url,
        method: 'POST',
        body: data,
      }),
    }),
    editResource: builder.mutation({
      query: ({ url, data }) => ({
        url,
        method: 'PUT',
        body: data,
      }),
    }),
    patchResource: builder.mutation({
      query: ({ url, data }) => ({
        url,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteResource: builder.mutation({
      query: (url) => ({
        url,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchResourceQuery, 
  useDeleteResourceMutation, 
  useCreateResourceMutation,
  usePatchResourceMutation, 
  useEditResourceMutation} = crudApi;

  export default crudApi