import PageLayout from "src/pages/Admin/_components/PageLayout";
import Table from "components/Global/Table";
import { TableColumn } from "components/Global/Table/types";
import { useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  QuerySettlementAccountsPayload,
  VASettlementHistoryResponse,
  VirtualAccountResponse,
} from "src/redux/features/admin/types/virtualAccountType";
import usePersistedBusiness from "src/hooks/usePersistentBusiness";
import { useGetVASettlementHistoryQuery } from "src/redux/features/admin/virtualAccountSlice";
import { formatCurrency } from "src/utilities/formatCurrency";
import EmptyData from "components/Global/EmptyData";
import empty from "../../../../../../../assets/images/empty.png";

const SettlementHistory = ({
  virtualAccount,
}: {
  virtualAccount: VirtualAccountResponse["data"][0] | null;
}) => {
  const { business } = usePersistedBusiness();

  const [searchParams, setSearchParams] = useSearchParams();

  const { environment } = useSelector(selectEnvironment);
  const [pagination, setPagination] = useState({
    pageNumber: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    pageSize: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10,
  });
  useEffect(() => {
    searchParams.set("page", `${pagination.pageNumber}`);
    searchParams.set("size", `${pagination.pageSize}`);
    setSearchParams(searchParams);
  }, [pagination]);

  // Get VA Settlement History
  const query: QuerySettlementAccountsPayload = {
    environment,
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
    businessUUID: business?.uuid,
    virtualAccountId: virtualAccount?.id,
  };
  const { data, isLoading } = useGetVASettlementHistoryQuery(query, {
    skip: !business?.uuid || !virtualAccount,
  });

  const settlementAccounts = data?.data;
  const totalCount = data?.count;

  const settlementHistoryColumn: TableColumn<
    VASettlementHistoryResponse["data"][0]
  >[] = [
    {
      header: "Account Name",
      accessorFn: (rowData) => rowData.settlementAccount?.accountName,
      enableSorting: false,
    },
    {
      header: "Account Number",
      accessorFn: (rowData) => rowData.settlementAccount?.accountNumber,
      enableSorting: false,
    },
    {
      header: "Bank",
      accessorFn: (rowData) => rowData.settlementAccount?.bankName,
      enableSorting: false,
    },
    {
      header: "Settled Amount",
      accessorFn: (rowData) => formatCurrency(rowData.amount, rowData.currency),
      enableSorting: false,
    },
    {
      header: "Fee",
      accessorFn: (rowData) => formatCurrency(rowData.fee, rowData.currency),
      enableSorting: false,
    },
    {
      header: "Split Type",
      accessorFn: (rowData) => rowData.settlementAccount?.splitType,
      enableSorting: false,
    },
    {
      header: "Split Value",
      accessorFn: (rowData) =>
        `${
          rowData.settlementAccount?.splitType.toLowerCase() === "flat"
            ? formatCurrency(
                rowData.settlementAccount?.splitPercentage,
                rowData.currency
              )
            : `${rowData.settlementAccount?.splitPercentage}%`
        }`,
      enableSorting: false,
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      enableSorting: false,
    },
    {
      header: "Date Settled",
      accessorKey: "settledAt",
      enableSorting: false,
    },
  ];

  return (
    <PageLayout
      title={``}
      description={""}
      // goBack={false}
    >
      {virtualAccount ? (
        <Table
          data={settlementAccounts ?? []}
          columns={settlementHistoryColumn}
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
      ) : (
        <EmptyData
          iconSrc={empty}
          message="Select a virtual account to  see the settlement split"
        />
      )}
    </PageLayout>
  );
};

export default SettlementHistory;
