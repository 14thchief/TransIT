import styles from "./styles.module.scss";
import Button from "components/Core/Button";
import PageLayout from "../../_components/PageLayout";
import { UserAdd } from "src/assets/icons/icons";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createColumnHelper } from "@tanstack/react-table";
import { TableColumn } from "components/Global/Table/types";
import TableDropdownActions from "components/Global/Table/TableDropdownActions";
import Toggle from "components/Global/Toggle";
import Table from "components/Global/Table";
import {
  useAssignUserRoleMutation,
  useGetUsersQuery,
  useInviteUserMutation,
  useResendUserInviteMutation,
  useToggleUserLoginStatusMutation,
} from "src/redux/features/admin/userManagementSlice";
import { useGetRolesQuery } from "src/redux/features/admin/rolesManagementSlice";
import FormElement from "components/Core/FormElements/FormElement";
import Modal from "components/Core/Modal";
import { BsSend } from "react-icons/bs";
import StatusBadge from "components/Global/StatusBadge";
import { Status } from "components/Global/StatusBadge/types";
import { useDispatch } from "react-redux";
import { openActionModal } from "src/redux/features/util/actionModalSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const methods = useForm({
    mode: "all",
  });
  const { handleSubmit, reset } = methods;
  const [showForm, setShowForm] = useState(false);

  // Data Rendering
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const queryOptions = {
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
  };

  const { data, isLoading } = useGetUsersQuery(queryOptions);
  const users = data?.users;
  const totalCount = data?.adminCount;

  const { data: rolesData } = useGetRolesQuery(undefined, {
    skip: isLoading,
  });
  const roles = rolesData ?? [];

  const columnHelper = createColumnHelper<any>();

  const UsersColumns: TableColumn<any>[] = [
    {
      header: "Full Name",
      accessorFn: (rowData) =>
        `${rowData.first_name ?? ""} ${rowData.last_name ?? ""}`,
      enableSorting: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: false,
    },
    {
      header: "Role",
      accessorFn: (data) => data.role.name,
      enableSorting: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <StatusBadge status={getValue() as Status} textOnly>
          {getValue() as Status}
        </StatusBadge>
      ),
      enableSorting: false,
    },
    {
      header: "Login",
      accessorKey: "can_login",
      cell: ({ getValue }) => (
        <StatusBadge status={getValue() ? "active" : "inactive"} textOnly>
          {getValue() as Status}
        </StatusBadge>
      ),
      enableSorting: false,
    },
    {
      header: "Date Created",
      accessorKey: "created_at",
      enableSorting: false,
    },
    // {
    //   header: "Last Update",
    //   accessorKey: "updated_at",
    //   cell: ({ row }) => row.original.updated_at ?? <NotavailableText />,
    //   enableSorting: false,
    // },
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <TableDropdownActions
            actions={[
              {
                label: "Resend Invite",
                onClick: () => null,
                icon: <BsSend />,
                customComponent: (
                  <div className={styles.toggleWrapper}>
                    <p>Resend Invite</p>
                    <label
                      className={`
                        ${styles.resendButton}
                      `}
                      onClick={() => handleResendInvitation(row.original.email)}
                    >
                      <BsSend />
                      {isResendingInvitation
                        ? "Resending Invite..."
                        : "Resend Invite"}
                    </label>
                  </div>
                ),
              },
              {
                label: "Assign New Role",
                onClick: () => null,
                customComponent: (
                  <label className={styles.selectLabel}>
                    Assign New Role
                    <select
                      name="roleId"
                      defaultValue={row.original.role?.id}
                      onChange={({ target }) => {
                        const value = target.value;
                        dispatch(
                          openActionModal({
                            isOpen: true,
                            type: "warning",
                            title: `Update User Role`,
                            content: `Are you sure you want to update this user's role?`,
                            callback: () =>
                              handleAssignRole(row.original.id, value),
                            cancelText: "Cancel",
                          })
                        );
                      }}
                    >
                      {roles.map((role) => (
                        <option value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </label>
                ),
              },
              {
                label: "Toggle Login Status",
                onClick: () => null,
                customComponent: (
                  <div className={styles.toggleWrapper}>
                    <p>Toggle Login Status</p>
                    <label
                      className={`
                        ${styles.toggleLabel}
                    `}
                    >
                      <Toggle
                        id={"can_login"}
                        checked={row.original.can_login}
                        onChange={() =>
                          dispatch(
                            openActionModal({
                              isOpen: true,
                              type: "warning",
                              title: `${
                                row.original.can_login ? "Disable" : "Enable"
                              } User Login`,
                              content: `Are you sure you want to ${
                                row.original.can_login ? "Disable" : "Enable"
                              } User Login?`,
                              callback: () =>
                                handleToggleLogin(
                                  row.original.id,
                                  !row.original.can_login
                                ),
                              callbackText: isToggling
                                ? `${
                                    row.original.can_login
                                      ? "Disabling..."
                                      : "Enabling..."
                                  }`
                                : `${
                                    row.original.can_login
                                      ? "Disable Login"
                                      : "Enable Login"
                                  }`,
                              cancelText: "Cancel",
                            })
                          )
                        }
                        offColor="#d3d3d3"
                        onColor="#01821D"
                      />
                      {row.original.can_login
                        ? "Disable User Login"
                        : "Enable User Login"}
                    </label>
                  </div>
                ),
              },
            ]}
          />
        </div>
      ),
      header: "Actions",
      enableSorting: false,
    }),
  ];

  // Data Mutation
  const [sendUserInvite, { isLoading: isInviteLoading }] =
    useInviteUserMutation();
  const handleInviteUser = (data: FieldValues) => {
    const fmtData = data.roleId.value
      ? { ...data, roleId: data.roleId.value }
      : data;

    dispatch(
      openActionModal({
        isOpen: true,
        type: "warning",
        title: `Send Invite to New User`,
        content: `Are you sure you want to invite this user to SoftGATE?`,
        callback: () => {
          sendUserInvite(fmtData as any)
            .unwrap()
            .then((result) => {
              if (result.status) {
                resetStateData();
                toast.success(result.message);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        },
        cancelText: "Cancel",
      })
    );
  };

  const [resendInvitation, { isLoading: isResendingInvitation }] =
    useResendUserInviteMutation();
  const handleResendInvitation = (email: string) => {
    dispatch(
      openActionModal({
        isOpen: true,
        type: "warning",
        title: `Resend Invite to User`,
        content: `Are you sure you want to reinvite this user to SoftGATE?`,
        callback: () => {
          resendInvitation(email)
            .unwrap()
            .then((result) => {
              if (result.status) {
                resetStateData();
                toast.success(result.message);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        },
        cancelText: "Cancel",
      })
    );
  };

  const [toggleLoginStatus, { isLoading: isToggling }] =
    useToggleUserLoginStatusMutation();
  const handleToggleLogin = (userId: string, status: boolean) => {
    const toastId = toast.loading("Toggling User Login...");
    toggleLoginStatus({ userId, can_login: status })
      .unwrap()
      .then((result) => {
        if (result.status) {
          toast.dismiss(toastId);
          toast.success(result.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        console.error(err);
      });
  };

  const [assignRole] = useAssignUserRoleMutation();
  const handleAssignRole = (userId: string, roleId: string) => {
    const toastId = toast.loading("Updating User Role...");
    assignRole({ userId, roleId })
      .unwrap()
      .then((result) => {
        if (result.status) {
          toast.dismiss(toastId);
          toast.success(result.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        console.error(err);
      });
  };

  // Absolute Data Reset function
  const resetStateData = () => {
    setShowForm(false);
    reset({
      firstName: null,
      lastName: null,
      roleId: null,
      email: null,
    });
  };

  return (
    <PageLayout
      title="Invite and Manage Users within your Organization"
      titleVariant="smaller"
      actions={[
        <Button
          variant="main-reverse"
          icon={<UserAdd />}
          text={"Invite User"}
          onClick={() => {
            setShowForm(true);
          }}
        />,
      ]}
    >
      <Table
        data={users ?? []}
        columns={UsersColumns}
        useHeader={false}
        loading={isLoading}
        tableProps={{
          isPaginated: "server",
          serverPagination: {
            totalData: totalCount || 0,
            pageIndex: pagination.pageNumber - 1,
            pageSize: pagination.pageSize,
            setPageIndex: (index) =>
              setPagination((prev) => ({ ...prev, pageNumber: index + 1 })),
            setPageSize: (size) =>
              setPagination((prev) => ({ ...prev, pageSize: size })),
          },
        }}
      />

      <Modal open={showForm} onClose={resetStateData}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleInviteUser) as () => void}>
            <FormElement
              type="text"
              fieldName="firstName"
              fieldLabel="First Name"
              required
            />
            <FormElement
              type="text"
              fieldName="lastName"
              fieldLabel="Last Name"
              required
            />
            <FormElement
              type="email"
              fieldName="email"
              fieldLabel="Email"
              required
            />
            <FormElement
              type="select"
              fieldName="roleId"
              fieldLabel="Assign Role"
              placeholder="Select Role"
              // defaultValue={{label: editData?.payment_processor?.name, value: editData?.payment_processor?.id}}
              optionsData={
                roles?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) || []
              }
              required
            />
            <div className={styles.buttonsRow}>
              <Button
                text="Cancel"
                type="reset"
                variant="main-reverse"
                onClick={resetStateData}
              />
              <Button
                text="Send"
                icon={<BsSend />}
                type="submit"
                variant="main"
                isLoading={isInviteLoading}
              />
            </div>
          </form>
        </FormProvider>
      </Modal>
    </PageLayout>
  );
};

export default UserManagement;
