import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-email",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forgot-password",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      // Accept either `value` (body) or an object { body, headers }
      query: (value) => {
        const body = value && value.body !== undefined ? value.body : value;
        const headers = value && value.headers ? value.headers : undefined;
        return {
          method: "POST",
          url: "/auth/reset-password",
          body,
          headers,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/user",
          body: data,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    profile: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user/profile",
        };
      },
      // backend returns { success, message, data: { ...user } }
      transformResponse: (response) => {
        // prefer response.data if present, otherwise fall back to response.user
        return response?.data ?? response?.user ?? response;
      },
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
