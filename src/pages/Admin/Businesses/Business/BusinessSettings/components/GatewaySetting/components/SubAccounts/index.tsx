import styles from "./styles.module.scss";
import { useGetSubAccountsQuery } from "src/redux/features/admin/gatewaySlice";
import { useSelector } from "react-redux";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
import { useState } from "react";
import StatusBadge from "components/Global/StatusBadge";
import { Status } from "components/Global/StatusBadge/types";
import { formatDateWithCustomFormat } from "src/utilities/formatDate";
import Table from "components/Global/Table";
import { TableColumn } from "components/Global/Table/types";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { AccountResponse } from "src/redux/features/admin/types/gatewayType";
import { formatCurrency } from "src/utilities/formatCurrency";
import { useBank } from "src/hooks/useBank";

const SubAccounts = () => {
	const {highlightedBusiness} = useSelector(selectBusiness);
	const {environment} = useSelector(selectEnvironment);
	const { getBankName } = useBank();
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageNumber: 1,
    });

    const { data: subAccountsResponse, isLoading } = useGetSubAccountsQuery({
        businessID: highlightedBusiness?.id as string,
        page: pagination.pageNumber,
        per_page: pagination.pageSize,
		environment,
    }, {
        skip: !highlightedBusiness,
    });

    const accountsColumn: TableColumn<{[key: string]: any}>[] = [
		{
		  header: "Account Name",
		  accessorKey: "account_name",
		  enableSorting: false,
		},
		{
		  header: "Account Number",
		  accessorKey: "account_number",
		  enableSorting: false,
		},
		{
		  header: "Bank Name",
		  accessorKey: "bank_name",
		  enableSorting: false,
		  cell: ({ getValue, row }) => {
			return getValue() ?? getBankName(row.original.bank_code) ?? <p style={{color:"lightgray"}}>{"N/A"}</p>
		  },
		},
		{
		  header: "Bank Code",
		  accessorKey: "bank_code",
		  enableSorting: false,
		  cell: ({ getValue }) => {
			return getValue() ?? <p style={{color:"lightgray"}}>{"N/A"}</p>
		  },
		},
		{
		  header: "Split Fee",
		  accessorKey: "split_percentage",
		  enableSorting: false,
		  cell: ({ row }) => {
			const rowData = row.original as AccountResponse["accounts"][0];
			const itemValue = rowData.split_percentage;

			if (itemValue) {
				return rowData.split_type === "percentage"? `${itemValue}%` : formatCurrency(Number(itemValue), rowData.currency || "NGN")
			}

			return <p style={{color:"lightgray"}}>{"N/A"}</p>
		  },
		},
		{
		  header: "Split Type",
		  accessorKey: "split_type",
		  enableSorting: false,
		  cell: ({ getValue }: { getValue: any }) => {
			return getValue() ?? <p style={{color:"lightgray"}}>{"N/A"}</p>
		  },
		},
		{
		  header: "Status",
		  accessorKey: "status_id",
		  cell: ({ getValue }: { getValue: any }) => (
			<StatusBadge textOnly status={(getValue() as string).toLowerCase() as Status}>
			  {(getValue() as string) || "Inactive"}
			</StatusBadge>
		  ),
		  enableSorting: false,
		},
		{
		  header: "Date Added",
		  accessorKey: "created_at",
		  enableSorting: false,
		  cell: ({ getValue }: { getValue: any }) => {
			return formatDateWithCustomFormat(getValue(), "DD-MM-YYYY");
		  },
		},
	];

    return (
        <div className={styles.container}>
            <div className={styles.alertBar}>

            </div>
            <Table 
                data={subAccountsResponse?.accounts ?? []}
                columns={accountsColumn}
                useHeader={false}
                loading={isLoading}
                tableProps={{
                    isPaginated: "server",
                    serverPagination: {
                    totalData: subAccountsResponse?.accountsCount || 0,
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
    )
}

export default SubAccounts;