import authApi from "src/redux/api/authApi";
import {
	ValidateIdPayload,
	ValidateResponse,
} from "./types/validateIdentityType";

const signupSlice = authApi.injectEndpoints({
	endpoints: (builder) => ({
		validateIdentity: builder.mutation<ValidateResponse, ValidateIdPayload>({
			query: (data) => ({
				url: "admin/validate-identity",
				method: "POST",
				body: data,
			}),
			transformResponse: (response: ValidateResponse) => {
				return response;
			},
		}),
	}),
});

export const { useValidateIdentityMutation } = signupSlice;
export default signupSlice;
