import React from "react";
import useSessionUserRole from "src/hooks/useSessionUserRole";
import { hasPermission } from "src/utilities/permissionBasedAccess";

interface PermissionWrapperProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { permissions } = useSessionUserRole();

  return hasPermission(permissions, permission) ? (
    <>{children}</>
  ) : (
    <>{fallback}</>
  );
};

export default PermissionWrapper;
