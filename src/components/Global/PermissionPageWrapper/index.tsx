import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useSessionUserRole from "src/hooks/useSessionUserRole";
import { hasAnyPermission } from "src/utilities/permissionBasedAccess";

interface PermissionProtectedRouteProps {
  requiredPermissions: string[];
  fallbackRoute: string;
}

const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  requiredPermissions,
  fallbackRoute,
}) => {
  const { permissions } = useSessionUserRole();

  return hasAnyPermission(permissions, requiredPermissions) ? (
    <Outlet />
  ) : (
    <Navigate to={fallbackRoute} />
  );
};

export default PermissionProtectedRoute;
