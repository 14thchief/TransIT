import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import RouteWrapper from "./RouteWrapper";
import Businesses from "src/pages/Admin/Businesses";
import PermissionProtectedRoute from "components/Global/PermissionPageWrapper";

const AdminRoutes = () => {
  // const {
  //    rolePermissionModulePermissions,
  //   businessModulePermissions,
  // } = useAllModulePermissions();

  return (
    <Routes>
      <Route index element={<Navigate to="businesses" replace />} />
      <Route
        element={
          <RouteWrapper>
            <Outlet />
          </RouteWrapper>
        }
      >
        <Route
          path="businesses"
          element={
            <PermissionProtectedRoute
              requiredPermissions={[]}
              fallbackRoute="/admin/businesses"
            />
          }
        >
          <Route path="" element={<Businesses />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
