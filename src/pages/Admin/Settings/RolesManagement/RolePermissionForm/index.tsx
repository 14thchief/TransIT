import Button from "components/Core/Button";
import styles from "./styles.module.scss";
import FormElement from "components/Core/FormElements/FormElement";
import React, { useState, useEffect } from "react";
import {
  useCreateRolesMutation,
  useEditRolesMutation,
} from "src/redux/features/admin/rolesManagementSlice";
import {
  Permission,
  PermissionAction,
} from "src/redux/features/admin/types/roleManagementType";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";

interface PermissionState {
  [permissionName: string]: {
    [action in PermissionAction]?: boolean;
  };
}

interface RolePermissionFormProps {
  existingRoleDetails?: { id: string; name: string; description: string };
  existingPermissions?: Permission[]; // Permissions already assigned to the role (edit mode)
  mode: "create" | "edit"; // Mode to determine behavior
  afterSubmit: () => void;
  methods: UseFormReturn<FieldValues, any, undefined>;
  data: Permission[];
  showForm: boolean;
}

const RolePermissionForm: React.FC<RolePermissionFormProps> = ({
  existingRoleDetails,
  existingPermissions = [],
  mode,
  methods,
  afterSubmit,
  data,
  showForm,
}) => {
  const { reset, handleSubmit } = methods;
  const permissions = data || [];
  const [permissionState, setPermissionState] = useState<PermissionState>({});
  useEffect(() => {
    !showForm && setPermissionState({});
  }, [showForm]);

  const [columnSelection, setColumnSelection] = useState<
    Record<PermissionAction, boolean>
  >({
    all: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  // Initialize state from existing permissions in edit mode
  useEffect(() => {
    if (mode === "edit" && existingPermissions.length > 0) {
      // Set role name and description in edit mode
      if (existingRoleDetails) {
        reset({
          name: existingRoleDetails.name || "",
          description: existingRoleDetails.description || "",
        });
      }

      const initialState: PermissionState = {};
      existingPermissions.forEach((permission) => {
        const [prefix, action] = permission.name.split(":") as [
          string,
          PermissionAction
        ];
        if (!initialState[prefix]) {
          initialState[prefix] = {};
        }
        initialState[prefix][action] = true;
        if (action === "all") {
          ["create", "read", "edit", "delete"].forEach((act) => {
            initialState[prefix][act as PermissionAction] = true;
          });
        }
      });
      setPermissionState(initialState);

      return () => setPermissionState({});
    }
  }, [existingPermissions, mode]);

  // Handle individual action toggle
  const toggleAction = (permissionName: string, action: PermissionAction) => {
    setPermissionState((prev) => {
      const updatedState = {
        ...prev,
        [permissionName]: {
          ...prev[permissionName],
          [action]: !prev[permissionName]?.[action],
        },
      };

      // Handle "all" toggle logic for rows
      if (action === "all") {
        const isChecked = !prev[permissionName]?.[action];
        ["create", "read", "edit", "delete"].forEach((act) => {
          updatedState[permissionName][act as PermissionAction] = isChecked;
        });
      } else {
        // Update "all" if all actions are checked
        const allChecked = ["create", "read", "edit", "delete"].every(
          (act) => updatedState[permissionName][act as PermissionAction]
        );
        updatedState[permissionName].all = allChecked;
      }

      return updatedState;
    });
  };

  // Handle "Check All" for a column
  const toggleColumn = (action: PermissionAction) => {
    const newColumnState = !columnSelection[action];
    setColumnSelection((prev) => ({ ...prev, [action]: newColumnState }));

    setPermissionState((prev) => {
      const updatedState = { ...prev };

      permissions.forEach((permission) => {
        const [prefix] = permission.name.split(":");

        if (!updatedState[prefix]) {
          updatedState[prefix] = {}; // Initialize if not already present
        }

        // Update the selected action
        updatedState[prefix][action] = newColumnState;

        // If the action is "all", toggle all other actions
        if (action === "all") {
          ["create", "read", "edit", "delete"].forEach((act) => {
            updatedState[prefix][act as PermissionAction] = newColumnState;
          });
          updatedState[prefix].all = newColumnState;
        } else {
          // If an individual action is toggled, update "all" accordingly
          const allActions: PermissionAction[] = [
            "create",
            "read",
            "edit",
            "delete",
          ];
          const allChecked = allActions.every(
            (act) => updatedState[prefix][act as PermissionAction]
          );
          updatedState[prefix].all = allChecked;
        }
      });

      return updatedState;
    });
  };

  // Handle form submission
  const [createRole, { isLoading: isCreateLoading }] = useCreateRolesMutation();
  const [editRole, { isLoading: isEditLoading }] = useEditRolesMutation();

  const handleCancel = () => {
    afterSubmit();
  };

  const selectedPermissions: Permission[] = [];

  Object.entries(permissionState).forEach(([prefix, actions]) => {
    Object.entries(actions).forEach(([action, isSelected]) => {
      if (isSelected && action !== "all") {
        const permission = permissions.find(
          (perm) => perm.name === `${prefix}:${action}`
        );
        if (permission) {
          selectedPermissions.push(permission);
        }
      }
    });
  });

  const onSubmit = (data: FieldValues) => {
    // e.preventDefault();

    mode === "edit" && existingRoleDetails
      ? editRole({
          id: existingRoleDetails?.id,
          name: data.name,
          description: data.description,
          permissions: selectedPermissions?.map((x) => x.id),
        })
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Role Updated successfully!");
            afterSubmit();
          })
          .catch((error) => {
            console.error({ error });
          })
      : createRole({
          name: data.name,
          description: data.description,
          permissions: selectedPermissions?.map((x) => x.id),
        })
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Role created successfully!");
            afterSubmit();
          })
          .catch((error) => {
            console.error({ error });
          });
  };

  return (
    <div
      className={styles.formWrapper}
      style={{ display: !showForm ? "none" : "block" }}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputRows}>
            <FormElement
              type="text"
              fieldName={`name`}
              fieldLabel={"Role Name"}
              validateFn={(value) => {
                return (value as string).length < 2
                  ? "Invalid name, Please use a valid name"
                  : true;
              }}
              isValidated
              required
            />
            <FormElement
              type="text"
              fieldName={`description`}
              fieldLabel={"Role Description"}
              validateFn={(value) => {
                return (value as string).length < 3
                  ? "Invalid name, Please use a valid description"
                  : true;
              }}
              isValidated
              required
            />
          </div>
          <div className={styles.tableWrapper}>
            <h1>Assign Permissions to this Role</h1>
            <table border={0} style={{ width: "100%", textAlign: "left" }}>
              <thead>
                <tr>
                  <th>Permission Name</th>
                  {(
                    [
                      "all",
                      "create",
                      "read",
                      "edit",
                      "delete",
                    ] as PermissionAction[]
                  ).map((action) => (
                    <th key={action}>
                      <input
                        type="checkbox"
                        checked={columnSelection[action]}
                        onChange={() => toggleColumn(action)}
                      />
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions
                  .reduce((acc, permission) => {
                    const [prefix] = permission.name.split(":");
                    if (!acc.includes(prefix)) acc.push(prefix);
                    return acc;
                  }, [] as string[])
                  .map((permissionName) => (
                    <tr key={permissionName}>
                      <td>{permissionName}</td>
                      {(
                        [
                          "all",
                          "create",
                          "read",
                          "edit",
                          "delete",
                        ] as PermissionAction[]
                      ).map((action) => (
                        <td key={action}>
                          <input
                            type="checkbox"
                            checked={
                              !!permissionState[permissionName]?.[action]
                            }
                            onChange={() =>
                              toggleAction(permissionName, action)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={styles.buttonsRow}>
            <Button
              text="Cancel"
              type="reset"
              variant="main-reverse"
              onClick={handleCancel}
            />
            <Button
              text="Save Role"
              type="submit"
              variant={selectedPermissions?.length < 1 ? "alt" : "main"}
              isLoading={isCreateLoading || isEditLoading}
              disabled={selectedPermissions?.length < 1}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default RolePermissionForm;
