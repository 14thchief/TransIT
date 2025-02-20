import PageLayout from "../../_components/PageLayout";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, UserAdd } from "src/assets/icons/icons";
import {
  useGetPermissionsQuery,
  useGetRolesQuery,
} from "src/redux/features/admin/rolesManagementSlice";
import { Role } from "src/redux/features/admin/types/roleManagementType";
import RolePermissionForm from "./RolePermissionForm";
import Button from "components/Core/Button";
import { useForm } from "react-hook-form";
import SuspenseElement from "components/Global/SuspenseElement";

const RolesManagement = () => {
  const methods = useForm({ mode: "all" });
  const { reset } = methods;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  useEffect(() => {
    if (selectedRole) {
      searchParams.set("role", selectedRole?.name);
      setShowForm(true);
    } else {
      searchParams.delete("role");
      setSearchParams(searchParams);
    }
  }, [selectedRole]);

  const {
    data: rolesData,
    isLoading,
    isFetching,
  } = useGetRolesQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: permissionsData } = useGetPermissionsQuery(undefined, {
    skip: isLoading || isFetching,
  });

  const roles = rolesData ?? [];
  const rolePermissions = selectedRole?.permissions;

  const postSubmitEffect = () => {
    setSelectedRole(null);
    setShowForm(false);
    reset({
      name: "",
      description: "",
    });
  };

  return (
    <PageLayout
      title="Manage all Roles and access privileges through the Admin Dashboard"
      titleVariant="smaller"
      goBack={showForm ? "All roles" : undefined}
      goBackCb={() => {
        setSelectedRole(null);
        setShowForm(false);
        reset({
          name: "",
          description: "",
        });
      }}
      actions={
        showForm
          ? []
          : [
              <Button
                variant="main-reverse"
                icon={<UserAdd />}
                text={"Create Role"}
                onClick={() => {
                  setSelectedRole(null);
                  setShowForm(true);
                }}
              />,
            ]
      }
    >
      <div className={showForm ? styles.hidden : ""}>
        {isLoading ? (
          <SuspenseElement />
        ) : (
          <div className={styles.rolesContainer}>
            {roles?.map((item, i) => (
              <div
                className={styles.roleCard}
                onClick={() => setSelectedRole(item)}
                key={i}
              >
                <div className={styles.content}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  {/* <h6>
                    {item.permissions?.length} permission
                    {item.permissions?.length > 1 && "s"}
                  </h6> */}
                  <div className={styles.adminCircleContainer}>
                    {item.admins?.slice(0, 6).map((admin, i) => {
                      return (
                        <div key={i} className={styles.adminCircle}>
                          <p>
                            {admin.name?.split(" ")[0].slice(0, 1)}
                            {admin.name?.split(" ")[1].slice(0, 1)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.action}>
                  <ArrowRight size={24} color="gray" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RolePermissionForm
        mode={selectedRole ? "edit" : "create"}
        existingPermissions={rolePermissions}
        existingRoleDetails={{
          id: selectedRole?.id as string,
          name: selectedRole?.name ?? "",
          description: selectedRole?.description ?? "",
        }}
        afterSubmit={postSubmitEffect}
        methods={methods}
        data={permissionsData ?? []}
        showForm={showForm}
      />
    </PageLayout>
  );
};

export default RolesManagement;
