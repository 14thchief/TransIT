import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./baseApi";

const authApi = createApi({
	reducerPath: "auth",
	baseQuery: fetchBaseQuery({
		baseUrl: API_BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	}),

	tagTypes: ["authUser"],
	endpoints: () => ({}),
});

export default authApi;
