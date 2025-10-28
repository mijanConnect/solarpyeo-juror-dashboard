import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.7.46:5000/api/v1",
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
  }),
  endpoints: () => ({}),
});

export const imageUrl = "http://10.10.7.46:5000";
