import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://10.10.7.46:5000/api/v1";

// Base query with auth headers
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.error("Error preparing headers:", err);
    }
    return headers;
  },
});

// Wrapper to handle automatic token refresh on 401
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result?.error && result.error.status === 401) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // No refresh token available, clear tokens and return error
        localStorage.removeItem("token");
        return result;
      }

      // Attempt to refresh the access token
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.error) {
        // Refresh failed, clear all tokens
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return result;
      }

      // Extract new tokens from response
      const refreshData = refreshResult.data || {};
      const tokenPayload = refreshData.data || refreshData;
      const newAccessToken = tokenPayload.accessToken;
      const newRefreshToken = tokenPayload.refreshToken;

      if (newAccessToken) {
        // Save new tokens
        localStorage.setItem("token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry the original request with new token
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Profile"],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export const imageUrl = "http://10.10.7.46:5000";
