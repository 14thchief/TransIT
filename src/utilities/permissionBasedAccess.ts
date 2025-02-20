export const getUserPermissions = () =>
  JSON.parse(sessionStorage?.getItem("user") as string);

export const hasPermission = (
  userPermissions: string[],
  requiredPermission: string
): boolean => userPermissions.includes(requiredPermission);

export const hasAnyPermission = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean =>
  !requiredPermissions?.length ||
  requiredPermissions.some((perm) => userPermissions.includes(perm));

export const getModulePermissions = (module: string, permissions?: string[]) =>
  permissions?.filter((x) => x.includes(module)) || [];
