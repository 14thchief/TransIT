import Toggle from "components/Global/Toggle";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import Table from "components/Global/Table";
import { formatDateWithCustomFormat } from "src/utilities/formatDate";
import { TableColumn } from "components/Global/Table/types";
import { BusinessType } from "src/redux/features/admin/types/businessType";
import {
  useGetBusinessStatusAuditLogQuery,
  useToggleBusinessStatusMutation,
} from "src/redux/features/admin/businessesSlice";
import { useDispatch } from "react-redux";
import { highlightBusiness } from "src/redux/features/admin/util/businessSlice";
import { toast } from "react-toastify";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import PermissionWrapper from "components/Global/PermissionWrapper";

const ManageAccount = ({ account }: { account: BusinessType }) => {
  const isActiveAccount = account.status_id?.toLowerCase() === "active";

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const { data: auditLog } = useGetBusinessStatusAuditLogQuery(
    {
      businessID: account.id as string,
      query: {
        page: pagination.pageNumber,
        per_page: pagination.pageSize,
      },
    },
    {
      skip: !account?.id,
    }
  );

  const fmtAuditLog = auditLog?.map((item) => ({
    action: item.action,
    updatedAt: formatDateWithCustomFormat(item.time, "DD-MM-YYYY hh:mm:ss"),
    email: item.admin_email,
    name: item.admin_full_name,
    reason: item.reason,
  }));

  const [toggleBusinessStatus, { isLoading, isError }] =
    useToggleBusinessStatusMutation();
  useEffect(() => {
    if (isLoading) {
      toast.loading("Updating Business Status");
    } else if (isError) {
      toast.dismiss();
      toast.error("Update Error, Please try again");
    } else {
      toast.dismiss();
    }
  }, [isError, isLoading]);

  const [status, setStatus] = useState(isActiveAccount);
  const [notify] = useState(true);
  let reason = "";
  const dispatch = useDispatch();

  const handleToggleStatus = () => {
    dispatch(
      openActionModal({
        isOpen: true,
        title: `You are about to ${
          status ? "Deactivate" : "Activate"
        } this Business`,
        type: "warning",
        content: (
          <div className={styles.actionContentContainer}>
            {status ? (
              <p>
                You are about to Deactivate <span>{account.name} </span>
                from making or receiving any transactions.
              </p>
            ) : (
              <p>
                You are about to Activate <span>{account.name} </span>
                to resume making and receiving transactions.
              </p>
            )}

            <label className={styles.reason}>
              {`Reason for ${status ? "Deactivation" : "Activation"}:`}
              <textarea
                placeholder="Enter a reason..."
                rows={3}
                onChange={({ target }) => {
                  reason = target.value;
                }}
                // value={reason}
              />
            </label>
          </div>
        ),
        callback: handleChangeStatus,
        cancelText: "Cancel",
        callbackText: `Continue`,
        // extraButtonText: null,
      })
    );
  };

  const handleChangeStatus = () => {
    if (!reason && status) {
      return toast.error(
        "Please enter a reason for Deactivating this Business."
      );
    }

    toggleBusinessStatus({
      uuid: account?.uuid as string,
      reason,
      is_active: !isActiveAccount,
      notify,
    })
      .unwrap()
      .then(() => {
        setStatus(!isActiveAccount);
        dispatch(
          highlightBusiness({
            ...account,
            status_id: isActiveAccount ? "Inactive" : "Active",
          })
        );
      })
      .catch((error) => console.error({ error }));
  };

  const auditHistoryColumns: TableColumn<object>[] = [
    {
      header: "Action",
      accessorKey: "action",
      enableSorting: false,
      cell: ({ getValue }: { getValue: any }) => (
        <p className={styles.actionText}>{getValue()}</p>
      ),
    },
    {
      header: "Timestamp",
      accessorKey: "updatedAt",
      enableSorting: false,
      cell: ({ getValue }: { getValue: any }) =>
        formatDateWithCustomFormat(getValue(), "DD-MM-YYYY hh:mm:ss"),
    },
    {
      header: "Reason",
      accessorKey: "reason",
      enableSorting: false,
      cell: ({ getValue }: { getValue: any }) =>
        getValue() ?? <p className={styles.actionText}>{getValue()}</p>,
    },
    {
      header: "Admin Name",
      accessorKey: "name",
      enableSorting: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: false,
    },
  ];

  return (
    <div className={styles.container}>
      <PermissionWrapper permission="business-status:edit">
        <div className={styles.statusContainer}>
          <p>Status</p>
          <label className={styles.toggleContainer}>
            <Toggle id={0} checked={status} onChange={handleToggleStatus} />
            <p>{status ? "Deactivate" : "Activate"}</p>
          </label>
        </div>
      </PermissionWrapper>
      <div className={styles.accountHistory}>
        <div className={styles.title}>
          <p>Account History</p>
        </div>
        <Table
          data={fmtAuditLog ?? []}
          columns={auditHistoryColumns}
          useHeader={false}
          loading={false}
          tableProps={{
            isPaginated: "server",
            serverPagination: {
              totalData: fmtAuditLog?.length || 0,
              pageIndex: pagination.pageNumber - 1,
              pageSize: pagination.pageSize,
              setPageIndex: (index) =>
                setPagination((prev) => ({ ...prev, pageNumber: index + 1 })),
              setPageSize: (size) =>
                setPagination((prev) => ({ ...prev, pageSize: size })),
            },
          }}
        />
      </div>
    </div>
  );
};

export default ManageAccount;
