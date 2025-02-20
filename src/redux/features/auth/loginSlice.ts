import authApi from "src/redux/api/authApi";
import {
  ResetPasswordPayload,
  SignedUser,
  SigninPayload,
} from "./types/loginType";
// import { toast } from "react-toastify";

const loginSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SignedUser, SigninPayload>({
      query: (data) => ({
        url: "regulators/login",
        method: "POST",
        body: {
          ...data,
        },
      }),
      transformResponse: (response: { data: SignedUser }) => {
        return response.data;
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("session_user", JSON.stringify(data));
          localStorage.setItem("token", data.accessToken);
        } catch (err: any) {
          // err.error.data.message && toast.error(typeof err.error?.data?.message === "string"? err.error.data.message : err.error.data.message[0]);
        }
      },
    }),
    sendResetLink: builder.mutation<SignedUser, SigninPayload["username"]>({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: {
          email: data,
        },
      }),
      transformResponse: (response: { data: SignedUser }) => {
        return response.data;
      },
    }),
    resetPassword: builder.mutation<SignedUser, ResetPasswordPayload>({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: SignedUser }) => {
        return response.data;
      },
    }),
    savePassword: builder.mutation<SignedUser, ResetPasswordPayload>({
      query: (data) => ({
        url: "user/account-setup",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: SignedUser }) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSendResetLinkMutation,
  useResetPasswordMutation,
  useSavePasswordMutation,
} = loginSlice;
export default loginSlice;
