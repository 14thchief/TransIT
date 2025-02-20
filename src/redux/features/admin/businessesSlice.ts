import adminApi from "src/redux/api/adminApi";
import { BusinessesResponseData, BusinessQueryPayload, BusinessStatusAuditLogRecord, CreateBusinessPayload, ToggleBusinessPayload } from "./types/businessType";



const businessesSlice = adminApi.injectEndpoints({
	endpoints: (builder) => ({
		getBusinesses: builder.query<BusinessesResponseData, BusinessQueryPayload>({
			query: (arg) => ({
				url: `business/businesses?
				${arg.search? `search=${arg.search}&` : ""}
				${arg.page? `page=${arg.page}&` : ""}
				${arg.per_page? `per_page=${arg.per_page}&` : ""}
				${arg.status? `status=${arg.status}&` : ""}
				${arg.start? `start=${arg.start}&` : ""}
				${arg.end? `end=${arg.end}&` : ""}
				${arg.environment? `environment=${arg.environment}` : ""}
				`,
			}),
			transformResponse: (response: { data: BusinessesResponseData }) => {
				return response.data;
			},
			providesTags: ["businesses"]
		}),
		getBusinessesExport: builder.query<BusinessesResponseData["businesses"], BusinessQueryPayload>({
			query: (arg) => ({
				url: `business/all?
				${arg.status? `status=${arg.status}&` : ""}
				${arg.start? `start=${arg.start}&` : ""}
				${arg.end? `end=${arg.end}&` : ""}
				${arg.environment? `environment=${arg.environment}&` : ""}
				`,
			}),
			transformResponse: (response: { data: { businesses: BusinessesResponseData["businesses"] }}) => {
				return response.data.businesses;
			},
			providesTags: ["businesses"]
		}),
		createBusiness: builder.mutation<any, CreateBusinessPayload>({
			query: (data) => ({
				url: "softpay/business",
				method: "POST",
				body: {
					...data,
					is_active: true
				},
			}),
			transformResponse: (response: any) => {
				return response.data;
			},
			invalidatesTags: ["businesses"]
		}),
		getBusinessStatusAuditLog: builder.query<BusinessStatusAuditLogRecord[], {businessID: string, query: BusinessQueryPayload}>({
			query: ({businessID, query: {page, per_page, start, end}}) => ({
				url: `audit-logs/business-status?
				resource_id=${businessID}&
				page=${page}&
				per_page=${per_page}&
				${start && `start=${start}&`}
				${end && `end=${end}`}
				`,
			}),
			transformResponse: (response: { data: { logs: BusinessStatusAuditLogRecord[] }}) => {
				return response.data.logs;
			},
			providesTags: ["logs"]
		}),
		toggleBusinessStatus: builder.mutation<any, ToggleBusinessPayload>({
			query: (data) => ({
				url: "business/toggle",
				method: "PATCH",
				body: data,
			}),
			transformResponse: (response: any) => {
				return response.data;
			},
			invalidatesTags: ["businesses", "logs"]
		}),
	}),
});

export const { 
	useGetBusinessesQuery,
	useGetBusinessesExportQuery,
	useCreateBusinessMutation,
	useToggleBusinessStatusMutation,
	useGetBusinessStatusAuditLogQuery,
} = businessesSlice;

export default businessesSlice;
