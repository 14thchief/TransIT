import authApi from "../api/authApi";
import baseApi from "../api/baseApi";
import adminApi from "../api/adminApi";

export const combineMiddlewares = [
  baseApi.middleware,
  authApi.middleware,
  adminApi.middleware,
];
