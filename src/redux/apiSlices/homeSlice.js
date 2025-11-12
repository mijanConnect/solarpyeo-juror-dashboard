import { api } from "../api/baseApi";

const homeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    summary: builder.query({
      query: () => {
        return {
          url: `/overview/revenue`,
          method: "GET",
        };
      },
    }),

    stats: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/overview/statistics?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["InitialSubmission"],
    }),
  }),
});

export const { useSummaryQuery, useStatsQuery } = homeSlice;
