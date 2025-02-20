import baseApi from "src/redux/api/baseApi";
import { CountryDataType, LovPayload, LovResponse } from "./types";

const lovSlice = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getLov: builder.query<LovResponse, LovPayload>({
			query: (code) => `lov/category/${code}`,
			transformResponse: (response: { data: { lovValues: LovResponse } }) => {
				return response.data.lovValues;
			},
		}),
		getCountries: builder.query<CountryDataType[], void>({
			query: () => `config/nationality`,
			transformResponse: (response: { data: CountryDataType[] }) => {
				return response.data;
			},
		}),
	}),
});
export const { useGetLovQuery, useGetCountriesQuery } = lovSlice;
export default lovSlice;
