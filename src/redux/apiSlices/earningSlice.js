import { api } from "../api/baseApi";

const earningSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    earnings: builder.query({
      query: ({ page, search }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);
        return {
          url: `/order/earning-history`,
          method: "GET",
        };
      },
    }),
    // report earnings by date range
    // reportEarnings: builder.query({
    //   query: ({ startDate, endDate }) => {
    //     const params = new URLSearchParams();
    //     if (startDate) params.append("startDate", startDate);
    //     if (endDate) params.append("endDate", endDate);
    //     return {
    //       url: `/report/earning?${params.toString()}`,
    //       method: "GET",
    //     };
    //   },
    //   transformResponse: (response) => response,
    // }),
    reportEarnings: builder.query({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return {
          url: `/report/earning`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const { useEarningsQuery, useReportEarningsQuery } = earningSlice;
