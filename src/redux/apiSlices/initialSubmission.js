import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const initialSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInitialSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/initial?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["InitialSubmission"],
    }),

    getSubmissionById: build.query({
      query: (id) => ({
        url: `/submission/initial/${id}`,
        method: "GET",
      }),
      providesTags: ["InitialSubmission"],
    }),

    updateSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/initial/document/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["InitialSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInitialSubmissionsQuery,
  useUpdateSubmissionMutation,
  useGetSubmissionByIdQuery,
} = initialSubmissionApi;
