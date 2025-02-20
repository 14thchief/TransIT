import styles from "./_styles.module.scss";
import Table from "components/Global/Table";
import StatusBadge from "components/Global/StatusBadge";
import { Status } from "components/Global/StatusBadge/types";
import { TableColumn } from "components/Global/Table/types";
import {
  useGetBusinessTransactionsExportQuery,
  useGetBusinessTransactionsQuery,
} from "src/redux/features/admin/transactionsSlice";
// import {v4 as uuidv4} from 'uuid';
import { useState } from "react";
import { useCSVDownloader } from "react-papaparse";
import {
  formatDateWithCustomFormat,
  toISOLocal,
} from "src/utilities/formatDate";
import Search from "components/Global/Search";
import SelectFilter from "components/Global/SelectFilter";
import Button from "components/Core/Button";
import { getUnixTime } from "date-fns";
import {
  TransactionItem,
  TransactionsQueryPayload,
} from "src/redux/features/admin/types/transactionType";
import { formatCurrency } from "src/utilities/formatCurrency";
// import Toggle from "components/Global/Toggle";
import DateRangeSelector from "components/Core/FormElements/DateRangeSelector";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import PageLayout from "src/pages/Admin/_components/PageLayout";
import usePersistedBusiness from "src/hooks/usePersistentBusiness";
import { formatTransactionsExport } from "src/pages/Admin/Transactions/utilities";
import useDebounce from "src/hooks/useDebounce";
import { useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";

type StatusStateType = TransactionsQueryPayload["status"] | "All";

const BusinessTransactions = () => {
  const { business } = usePersistedBusiness();
  const { CSVDownloader, Type } = useCSVDownloader();
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { environment } = useSelector(selectEnvironment);
  const [status, setStatus] = useState<StatusStateType>("All");
  const [channel, setChannel] = useState<string>("All");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const queryOptions: TransactionsQueryPayload = {
    search: debouncedSearch,
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
    status: status === "All" ? undefined : status,
    start: startDate && toISOLocal(startDate),
    channel: channel === "All" ? undefined : channel,
    end: endDate && toISOLocal(endDate),
    businessId: business?.id,
    environment,
  };
  const { data: transactionResponse, isLoading } =
    useGetBusinessTransactionsQuery(queryOptions);
  const { data: exportData } = useGetBusinessTransactionsExportQuery(
    queryOptions,
    {
      skip: !startDate || !endDate,
    }
  );

  const exportable = exportData ? formatTransactionsExport(exportData) : [];

  const trasactionsColumn: TableColumn<object>[] = [
    {
      header: "Transaction ID",
      accessorKey: "id",
      enableSorting: false,
    },
    {
      header: "Customer Email",
      accessorKey: "email_address",
      enableSorting: false,
    },
    {
      header: "Status",
      accessorKey: "status_id",
      cell: ({ getValue }: { getValue: any }) => (
        <StatusBadge
          textOnly
          status={(getValue() as string).toLowerCase() as Status}
        >
          {(getValue() as string) ?? (
            <p style={{ color: "lightgray" }}>{"N/A"}</p>
          )}
        </StatusBadge>
      ),
      enableSorting: false,
    },
    {
      header: "Time",
      accessorKey: "created_at",
      enableSorting: false,
      cell: ({ getValue }: { getValue: any }) => {
        return formatDateWithCustomFormat(getValue(), "DD-MM-YYYY hh:mm:ss");
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue, row }) =>
        formatCurrency(
          getValue() as number,
          (row.original as TransactionItem)?.currency ?? undefined
        ),
      enableSorting: false,
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: ({ row }) => {
        const name = (row.original as TransactionItem)?.payment_method?.name;
        return name;
      },
      enableSorting: false,
    },
    // {
    // 	header: "Transaction Status",
    // 	accessorKey: "status_id",
    // 	enableSorting: false,
    // },
    // {
    // 	header: "Settlement Status",
    // 	accessorKey: "status_id",
    // 	enableSorting: false,
    // },
    // {
    // 	header: "Business Name",
    // 	accessorKey: "business_name",
    // 	cell: ({ row }) => {
    // 		const name = (row.original as TransactionItem)?.business?.name;
    // 		return name;
    // 	},
    // 	enableSorting: false,
    // },
    // {
    // 	header: "Business Email",
    // 	accessorKey: "business_email",
    // 	cell: ({ row }) => {
    // 		const email = (row.original as TransactionItem)?.business?.email;
    // 		return email ?? <p style={{color:"lightgray"}}>{"N/A"}</p>;
    // 	},
    // 	enableSorting: false,
    // },
    // {
    // 	header: "Settlement Account",
    // 	accessorKey: "settlement_account",
    // 	enableSorting: false,
    // },
    {
      header: "Settlement Amount",
      accessorKey: "settlement_amount",
      cell: ({ row }) => {
        const settlementAmount =
          (row.original as TransactionItem)?.amount -
          (row.original as TransactionItem)?.fee_bearer_amount;
        return formatCurrency(
          settlementAmount,
          (row.original as TransactionItem)?.currency ?? undefined
        );
      },
      enableSorting: false,
    },
    {
      header: "Processor",
      accessorKey: "processor",
      cell: ({ row }) => {
        const processor = (row.original as TransactionItem)?.payment_processor
          ?.name;
        return processor;
      },
      enableSorting: false,
    },
    {
      header: "Fee",
      accessorKey: "fee_bearer_amount",
      cell: ({ getValue, row }) =>
        formatCurrency(
          getValue() as number,
          (row.original as TransactionItem)?.currency ?? undefined
        ),
      enableSorting: false,
    },
  ];

  return (
    <PageLayout
      title={``}
      description=""
      actions={[
        <SelectFilter
          value={status as string}
          title={"Status"}
          onSelect={(value) => setStatus(value as StatusStateType)}
          options={[
            "All",
            "Pending",
            "Paid",
            "Settled",
            "Failed",
            "Suspended",
            "Completed",
            "Reversed",
            "Active",
            "Inactive",
          ]}
        />,
        <SelectFilter
          value={channel}
          title={"Channel"}
          onSelect={(value) => setChannel(value)}
          options={[
            "All",
            "Bank Transfer",
            "Card",
            "USSD",
            "Bank Account",
            "Apple Pay",
            "Google Pay",
          ]}
        />,
        <label className={styles.dateFilter}>
          <div
            onClick={() => setShowDatePicker((prev) => !prev)}
            className={styles.dateRangeDisplay}
          >
            <p>
              {startDate
                ? `${startDate.toLocaleDateString("en-GB")} to 
							${endDate?.toLocaleDateString("en-GB")}`
                : "Select Date Range"}
            </p>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setShowDatePicker(false);
                }}
              >
                <MdCancel color={"red"} />
              </button>
            )}
          </div>
          <div
            className={`
							${styles.datePickerWrapper}
							${showDatePicker && styles.active}
						`}
            onMouseLeave={() => setShowDatePicker(false)}
          >
            <DateRangeSelector
              value={{
                startDate: startDate ?? new Date(),
                endDate: endDate ?? new Date(),
              }}
              onChange={(value) => {
                setStartDate(value.startDate);
                setEndDate(value.endDate);
              }}
            />
          </div>
        </label>,
        <Search
          placeholder="Search Transactions..."
          searchText={searchTerm}
          onSearch={setSearchTerm}
        />,
        <>
          {startDate ? (
            <CSVDownloader
              type={Type.Button}
              bom={true}
              filename={`transactions_softgate_${getUnixTime(new Date())}`}
              delimiter={";"}
              data={exportable}
            >
              <Button text="Export" />
            </CSVDownloader>
          ) : (
            <Button
              text="Export"
              onClick={() =>
                toast.error("Please Select a Date range to export.")
              }
            />
          )}
        </>,
      ]}
    >
      <div className={`${styles.dashboard}`}>
        <Table
          data={transactionResponse?.transactions ?? []}
          columns={trasactionsColumn}
          useHeader={false}
          loading={isLoading}
          tableProps={{
            isPaginated: "server",
            serverPagination: {
              totalData: transactionResponse?.transactionsCount || 0,
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
    </PageLayout>
  );
};

export default BusinessTransactions;
