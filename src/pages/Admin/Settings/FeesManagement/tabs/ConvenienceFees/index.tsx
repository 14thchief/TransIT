import styles from "./styles.module.scss";
import PageLayout from "src/pages/Admin/_components/PageLayout";
import Table from "components/Global/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { TableColumn } from "components/Global/Table/types";
import { useDispatch, useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { useEffect, useState } from "react";
import TableDropdownActions from "components/Global/Table/TableDropdownActions";
import { Eye } from "src/assets/icons/icons";
import { BusinessType } from "src/redux/features/admin/types/businessType";
import { highlightBusiness } from "src/redux/features/admin/util/businessSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetConvenienceFeeBusinessesQuery } from "src/redux/features/admin/feesMangementSlice";
import NotavailableText from "components/Global/NotAvailableText";

const ConvenienceFees = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const queryOptions = {
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
    environment,
  };

  const handleViewConvenienceFees = (rowData: BusinessType) => {
    dispatch(highlightBusiness(rowData));
    navigate(
      `/admin/businesses/${
        rowData?.name as string
      }?activeTab=settings&subPage=Convenience+Fees+Setting`,
      {
        state: { from: "Convenience Fees" },
      }
    );
  };

  // Data Rendering
  const { data, isLoading, isFetching } =
    useGetConvenienceFeeBusinessesQuery(queryOptions);
  const businesses = data?.businesses;
  const totalData = data?.businessesCount as number;

  const columnHelper = createColumnHelper<BusinessType>();

  const GlobalFeesColumn: TableColumn<BusinessType>[] = [
    {
      header: "Businesss Name",
      accessorKey: "name",
      cell: ({ getValue, row }) => {
        return (
          <p
            onClick={() => handleViewConvenienceFees(row.original)}
            className={styles.link}
          >
            {getValue() as BusinessType["name"]}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => row.original.email,
      enableSorting: false,
    },
    {
      header: "Date Created",
      accessorKey: "created_at",
      cell: ({ getValue }) => getValue() ?? <NotavailableText />,
      enableSorting: false,
    },
    {
      header: "Last Update",
      accessorKey: "updated_at",
      cell: ({ getValue }) => getValue() ?? <NotavailableText />,
      enableSorting: false,
    },
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <TableDropdownActions
            actions={[
              {
                label: "View Convenience Fees",
                icon: <Eye />,
                onClick: () => handleViewConvenienceFees(row.original),
              },
            ]}
          />
        </div>
      ),
      header: "Actions",
      enableSorting: false,
    }),
  ];

  return (
    <PageLayout
      title={``}
      description={""}
      // goBack={false}
    >
      <Table
        data={businesses ?? []}
        columns={GlobalFeesColumn}
        useHeader={false}
        loading={isLoading || isFetching}
        tableProps={{
          isPaginated: "server",
          serverPagination: {
            totalData: totalData ?? 0,
            pageIndex: pagination.pageNumber - 1,
            pageSize: pagination.pageSize,
            setPageIndex: (index) =>
              setPagination((prev) => ({ ...prev, pageNumber: index + 1 })),
            setPageSize: (size) =>
              setPagination((prev) => ({ ...prev, pageSize: size })),
          },
        }}
      />
    </PageLayout>
  );
};

export default ConvenienceFees;
