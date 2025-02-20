import {
  // BaseQueryFn,
  // FetchArgs,
  // FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./baseApi";
// import clearStore from "src/utilities/clearStore";

export const ALL_TAGS = [
  "businesses",
  "logs",
  "business processors",
  "transactions",
  "business payment methods",
  "business main accounts",
  "business sub accounts",
  "processors",
  "payment methods",
  "businessAPIkeys",
  "auto-settlement",
  "business fee settings",
  "reconciliation",
  "settlement",
  "global fees",
  "business custom fees",
  "convenience fees",
  "virtual settlement accounts",
  "business settlement activation",
  "roles",
  "users",
  "bank accounts",
  "Permissions",
];

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const adminApi = createApi({
  reducerPath: "admin",
  baseQuery,
  tagTypes: ALL_TAGS,
  endpoints: () => ({}),
});

export default adminApi;
