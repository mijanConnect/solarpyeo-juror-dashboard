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

// Wrapper to handle 401 errors - clear tokens and redirect to login
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If we get a 401 (unauthorized), clear tokens and redirect to login
  if (result?.error && result.error.status === 401) {
    // Clear all auth tokens
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    window.location.href = "/auth/login";
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
