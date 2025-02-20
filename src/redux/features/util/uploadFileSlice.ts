import baseApi from "src/redux/api/baseApi";

const lovSlice = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		uploadFiles: builder.mutation<string[], FormData>({
			query: (data) => {
				return {
					url: "fileupload/upload-file",
					method: "POST",
					body: data,
				};
			},
			transformResponse: (response: { data: string[] }) => {
				return response.data;
			},
		}),
	}),
});
export const { useUploadFilesMutation } = lovSlice;
export default lovSlice;
