import { Navigate, Outlet, useLocation } from "react-router-dom";
import { sidebarData } from "src/layout/AdminLayout/Sidebar/data";

const ProtectedRoutes = () => {
  const location = useLocation();

  const currentPath = location.pathname;
  const isLoggedIn = !!localStorage.getItem("token");

  const pathAccess = sidebarData.topRoutes
    .concat(sidebarData.bottomRoutes)
    .find((x) => currentPath.includes(x.path))?.access;

  const permitted = pathAccess === "*";

  return isLoggedIn && permitted ? (
    <Outlet />
  ) : (
    <Navigate to={"/auth/login"} state={{ from: currentPath }} replace />
  );
};

export default ProtectedRoutes;
