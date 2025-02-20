import styles from "./_styles.module.scss";
import PageLayout from "../_components/PageLayout";
import Table from "components/Global/Table";
import StatusBadge from "components/Global/StatusBadge";
import { Status } from "components/Global/StatusBadge/types";
import { TableColumn } from "components/Global/Table/types";
import {
  useGetBusinessesExportQuery,
  useGetBusinessesQuery,
} from "src/redux/features/admin/businessesSlice";
// import {v4 as uuidv4} from 'uuid';
import {
  BusinessType,
  BusinessQueryPayload,
} from "src/redux/features/admin/types/businessType";
import { useState } from "react";
import { useCSVDownloader } from "react-papaparse";
import TableDropdownActions from "components/Global/Table/TableDropdownActions";
import { Eye } from "src/assets/icons/icons";
import { formatDateWithCustomFormat } from "src/utilities/formatDate";
import Search from "components/Global/Search";
import SelectFilter from "components/Global/SelectFilter";
import MetricCard from "../_components/DataCard";
import CardIcon from "../_components/DataCard/components/CardIcon";
import {
  CgArrowBottomRight,
  CgArrowRight,
  CgArrowTopRight,
} from "react-icons/cg";
import Button from "components/Core/Button";
import { getUnixTime } from "date-fns";
import DateFilter from "components/Global/DateFilter";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { highlightBusiness } from "src/redux/features/admin/util/businessSlice";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import useDebounce from "src/hooks/useDebounce";

type StatusStateType = BusinessQueryPayload["status"] | "All";

const Businesses = () => {
  const navigate = useNavigate();
  const { CSVDownloader, Type } = useCSVDownloader();
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState<StatusStateType>("All");
  const [date, setDate] = useState<string | null>(null);

  const { environment } = useSelector(selectEnvironment);

  const queryOptions: BusinessQueryPayload = {
    search: debouncedSearch,
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
    status: status === "All" ? undefined : status,
    start: date,
    end: date,
    environment,
  };
  const {
    data: businessResponse,
    isLoading,
    isFetching,
  } = useGetBusinessesQuery(queryOptions);

  const { data: exportData } = useGetBusinessesExportQuery(queryOptions, {
    skip: !businessResponse || isLoading || isFetching,
  });
  // const [createBusiness] = useCreateBusinessMutation();

  // const handleCreateBusiness = () => {
  // 	createBusiness({
  // 		"uuid": myuuid,
  // 		"name": "Chief and Co",
  // 		"email": "chiefchief_fdkn6@mailsac.com",
  // 	})
  // 	.unwrap()
  // 	.then((result)=> {
  // 		console.log({ result })
  // 	})
  // 	.catch((error)=> {
  // 		console.error(error)
  // 	})
  // 	return;
  // }

  const businessesColumn: TableColumn<BusinessType>[] = [
    {
      header: "Business Name",
      accessorKey: "name",
      cell: ({ row, getValue }) => (
        <div
          onClick={() => {
            dispatch(highlightBusiness(row.original));
            navigate(`/admin/businesses/${row.original.name}`);
          }}
        >
          <p className={`${styles.link} ${styles.business_name}`}>
            {getValue() as BusinessType["name"]}
          </p>
        </div>
      ),
      enableSorting: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: false,
    },
    {
      header: "Phone Number",
      accessorKey: "phone",
      enableSorting: false,
      cell: ({ getValue }: { getValue: any }) => {
        return getValue() ?? <p style={{ color: "lightgray" }}>{"N/A"}</p>;
      },
    },
    {
      header: "Date Created",
      accessorKey: "created_at",
      enableSorting: false,
      cell: ({ getValue }: { getValue: any }) => {
        return formatDateWithCustomFormat(getValue(), "DD-MM-YYYY");
      },
    },
    {
      header: "Status",
      accessorKey: "status_id",
      cell: ({ getValue }: { getValue: any }) => (
        <StatusBadge
          textOnly
          status={(getValue() as string).toLowerCase() as Status}
        >
          {(getValue() as string) || "Inactive"}
        </StatusBadge>
      ),
      enableSorting: false,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <TableDropdownActions
            actions={[
              {
                label: "view",
                icon: <Eye />,
                onClick: () => {
                  dispatch(highlightBusiness(row.original));
                  navigate(`/admin/businesses/${row.original.name}`);
                },
              },
            ]}
          />
        </div>
      ),
      enableSorting: false,
    },
  ];

  const metrics = [
    {
      value: businessResponse?.totalBusinesses,
      description: "Total Businesses",
      icon: (
        <CardIcon arrow={<CgArrowTopRight size={20} />} severity={"warning"} />
      ),
      onClick: () => setStatus("All"),
    },
    {
      value: businessResponse?.totalActiveBusinesses,
      description: "Active Businesses",
      icon: (
        <CardIcon arrow={<CgArrowRight size={20} />} severity={"success"} />
      ),
      onClick: () => setStatus("Active"),
    },
    {
      value: businessResponse?.totalInactiveBusinesses,
      description: "Inactive Businesses",
      icon: (
        <CardIcon
          arrow={<CgArrowBottomRight size={20} />}
          severity={"critical"}
        />
      ),
      onClick: () => setStatus("Inactive"),
    },
  ];

  return (
    <PageLayout
      title={`Businesses`}
      description="See a list of all businesses registered on softgate."
      // filters={[
      // 	<
      // ]}
      actions={[
        <Search
          placeholder="Search Businesses..."
          searchText={searchTerm}
          onSearch={setSearchTerm}
        />,
        <CSVDownloader
          type={Type.Button}
          bom={true}
          filename={`Businesses_${getUnixTime(new Date())}`}
          delimiter={";"}
          data={exportData}
        >
          <Button text="Export" />
        </CSVDownloader>,
      ]}
    >
      <div className={`${styles.dashboard}`}>
        <div className={styles.metricCards}>
          {metrics?.map((item, i) => {
            return (
              <MetricCard
                key={i}
                value={isLoading ? "..." : item.value ?? 0}
                description={item.description}
                icon={item.icon}
                onClick={item.onClick}
              />
            );
          })}
        </div>
        <div className={styles.filters}>
          <SelectFilter
            value={status as string}
            title={"Status"}
            onSelect={(value) => setStatus(value as StatusStateType)}
            options={["All", "Active", "Inactive"]}
          />
          <SelectFilter
            value={status as string}
            title={"Date"}
            width="full"
            customFilter={
              <DateFilter
                onChange={(date) =>
                  setDate(
                    date
                      ? formatDateWithCustomFormat(
                          date?.toDateString(),
                          "YYYY-MM-DD",
                          {
                            digitalFormat: true,
                            padDate: true,
                          }
                        )
                      : null
                  )
                }
              />
            }
          />
        </div>
        <Table
          data={businessResponse?.businesses ?? []}
          columns={businessesColumn}
          useHeader={false}
          loading={isLoading || isFetching}
          tableProps={{
            isPaginated: "server",
            serverPagination: {
              totalData: businessResponse?.businessesCount || 0,
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

export default Businesses;
