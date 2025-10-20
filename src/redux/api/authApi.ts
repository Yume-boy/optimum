// 'use client'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryApi,
} from "@reduxjs/toolkit/query";

// --- Token response type ---
type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

// --- Base query setup ---
const baseQuery = fetchBaseQuery({
  baseUrl: "https://logistics.coldflamestechnologies.com/api",
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// --- Base query with re-auth handling ---
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api: BaseQueryApi, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized, handle refresh
  if (result.error && result.error.status === 401) {
    // 🧩 Skip refresh if request is logout
    const isLogoutRequest =
      typeof args === "string"
        ? args.includes("/auth/logout")
        : args?.url?.includes("/auth/logout");

    if (isLogoutRequest) {
      sessionStorage.clear();
      return result;
    }

    const refreshToken = sessionStorage.getItem("refreshToken");

    if (refreshToken) {
      console.log("🔁 Attempting token refresh...");
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          headers: { Authorization: `Bearer ${refreshToken}` },
        },
        api,
        extraOptions
      );

      // If refresh worked
      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data as RefreshResponse;

        // Save new tokens
        sessionStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          sessionStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("❌ Refresh failed. Logging out...");
        // sessionStorage.clear();
        // window.location.href = "/login"; // redirect to login
      }
    } else {
      console.warn("⚠️ No refresh token found. Logging out...");
      sessionStorage.clear();
      window.location.href = "/";
    }
  }

  return result;
};

// --- Auth API ---
const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({credentials, url}) => ({
        url,
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: ({credentials, url}) => ({
        url,
        method: "POST",
        body: credentials,
      }),
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/update-password",
        method: "PATCH",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // async onQueryStarted(_, { queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //   } catch (err) {
      //     console.warn("Logout request failed:", err);
      //   } finally {
      //     sessionStorage.clear();
      //     window.location.href = "/login";
      //   }
      // },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useUpdatePasswordMutation } =
  authApi;
export default authApi;
