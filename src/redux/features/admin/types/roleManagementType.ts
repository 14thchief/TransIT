export interface Permission {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  admins: { name: string; id: string }[];
}

export type PermissionAction = "all" | "create" | "read" | "edit" | "delete";

type PermissionCategory = Partial<Record<PermissionAction, Permission>>;

export type PermissionMap = Record<string, PermissionCategory>;
