import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout/AuthLayout";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { lazy } from "react";
import RouteWrapper from "./routes/RouteWrapper";

const App = () => {
	const AuthRoutes = lazy(() => import("./routes/AuthRoutes"));
	const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

	return (
		<Routes>
			<Route
				element={
					<RouteWrapper>
						<Outlet />
					</RouteWrapper>
				}
			>
				<Route>
					<Route path="/" element={<Navigate to={"/auth/login"} />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/auth/*" element={<AuthRoutes />} />
				</Route>
				<Route element={<ProtectedRoutes />}>
					<Route element={<AdminLayout />}>
						<Route path="/admin/*" element={<AdminRoutes />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
};

export default App;