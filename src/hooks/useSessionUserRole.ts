import { useGetPermissionsQuery } from "src/redux/features/admin/rolesManagementSlice";
import { getModulePermissions } from "src/utilities/permissionBasedAccess";

export const useSessionUserRole = (prop?: { searchPermission?: string }) => {
  const userRole = JSON.parse(
    localStorage.getItem("session_user") as string
  )?.role;

  const unfilteredPermissions: string[] =
    userRole?.permissions?.map((item: any) => item.name) ?? [];

  const permissions = unfilteredPermissions?.filter((item) =>
    !prop?.searchPermission
      ? true
      : item.split(":")[0]?.includes(prop.searchPermission)
  );

  return {
    permissions,
  };
};

export const usePermissions = (search?: string) => {
  const { data } = useGetPermissionsQuery();
  const permissions = search
    ? data?.filter((x) => x.name.includes(search))?.map((x) => x.name)
    : data?.map((x) => x.name);

  return permissions;
};

export const useAllModulePermissions = () => {
  const permissions = usePermissions();

  const paymentMethodModulePermissions = getModulePermissions(
    "payment-method",
    permissions
  );
  const businessModulePermissions = getModulePermissions(
    "business",
    permissions
  );
  const transactionsModulePermissions = getModulePermissions(
    "transaction",
    permissions
  );

  const gatewayModulePermissions = getModulePermissions(
    "gateway-management",
    permissions
  );

  const settlementModulePermissions = getModulePermissions(
    "settlement",
    permissions
  );

  const reconciliationModulePermissions = getModulePermissions(
    "reconcilation",
    permissions
  );
  const userManagementModulePermissions = getModulePermissions(
    "user-management",
    permissions
  );

  const globalFeeManagementModulePermissions = getModulePermissions(
    "global-fee-management",
    permissions
  );

  const convenienceFeeManagementModulePermissions = getModulePermissions(
    "convenience-fee-management",
    permissions
  );

  const rolePermissionModulePermissions = getModulePermissions(
    "role-permission",
    permissions
  );

  const paymentProcessorModulePermissions = getModulePermissions(
    "payment-processor",
    permissions
  );

  return {
    paymentMethodModulePermissions,
    paymentProcessorModulePermissions,
    rolePermissionModulePermissions,
    convenienceFeeManagementModulePermissions,
    businessModulePermissions,
    transactionsModulePermissions,
    gatewayModulePermissions,
    settlementModulePermissions,
    reconciliationModulePermissions,
    userManagementModulePermissions,
    globalFeeManagementModulePermissions,
  };
};

export default useSessionUserRole;
