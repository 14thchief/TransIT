import { useMemo, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowDownHi,
  ArrowUpHi,
  ArrowsExchangeV,
} from "src/assets/icons/icons";
import { TableProps } from "./types";
import TableFooter from "./TableFooter";
import SuspenseElement from "../SuspenseElement";
import EmptyData from "../EmptyData";
import styles from "./_styles.module.scss";
import { getColumnsWithHeader, getServerPagination } from "./data";

const Table = <T extends object>({
  data,
  columns,
  loading,
  useHeader = true,
  headerTitle,
  tableProps,
  countText,
}: TableProps<T>) => {
  const tableData = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [columns]);

  const {
    search,
    columnFilter,
    columnVisibility,
    isPaginated,
    serverPagination,
    isSorted = true,
    sortedColumns,
  } = tableProps || {};

  const [sorting, setSorting] = useState<SortingState>([]);

  const tableState = columnFilter
    ? {
        sorting,
        columnFilters: columnFilter || [],
        columnVisibility,
      }
    : {
        sorting,
        globalFilter: search,
        columnVisibility,
      };

  const totalData =
    isPaginated === "server" ? serverPagination.totalData : data.length;

  const tableInstance = useReactTable({
    data: tableData,
    columns: useHeader
      ? getColumnsWithHeader({ columns, totalData, headerTitle, countText })
      : tableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: isPaginated === "server",
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: tableState,
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanNextPage,
    getCanPreviousPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    getPageCount,
    // getPageOptions,
    getState,
  } = tableInstance;

  const {
    pagination: { pageIndex, pageSize },
  } = getState();

  const {
    getCanPreviousPageServer,
    getCanNextPageServer,
    previousPageServer,
    nextPageServer,
    setPageIndexServer,
    pageIndexServer,
    pageSizeServer,
    setPageSizeServer,
    getPageCountServer,
  } = getServerPagination({ isPaginated, serverPagination });

  const isDataAvailable = !!tableInstance.getRowModel().rows.length;

  return (
    <div className={styles.table_wrapper}>
      <div className={styles.table_header_body_wrapper}>
        {loading ? (
          <div className={styles.suspenseWrapper}>
            <SuspenseElement />
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              {getHeaderGroups().map((headerEl, index) => {
                const isTitleHeader = headerEl.headers[index].column.id === "Title";
                return (
                  <tr
                    key={headerEl.id}
                    className={
                      isTitleHeader ? styles.header_title : styles.header_row
                    }
                  >
                    {headerEl.headers.map((columnEl) => {
                      const sortOrder = columnEl.column.getIsSorted();
                      const sortIcon =
                        sortOrder === "asc" ? (
                          <ArrowUpHi size={16} />
                        ) : sortOrder === "desc" ? (
                          <ArrowDownHi size={16} />
                        ) : (
                          <ArrowsExchangeV size={16} />
                        );

                      const isColumnSorted = sortedColumns?.length
                        ? isSorted &&
                          columnEl.column.columnDef.enableSorting !== false &&
                          sortedColumns.includes(columnEl.column.id)
                        : isSorted &&
                          columnEl.column.columnDef.enableSorting !== false;
                      return (
                        <th key={columnEl.id} colSpan={columnEl.colSpan}>
                          <div className={styles[columnEl.column.id]}>
                            {columnEl.isPlaceholder
                              ? null
                              : flexRender(
                                  columnEl.column.columnDef.header,
                                  columnEl.getContext()
                                )}
                            {isColumnSorted && (
                              <span
                                onClick={columnEl.column.getToggleSortingHandler()}
                              >
                                {sortIcon}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            {isDataAvailable && (
                <tbody>
                  {getRowModel().rows.map((rowEl) => {
                    return (
                      <tr key={rowEl.id} className={styles.body_row}>
                        {rowEl.getVisibleCells().map((cellEl) => {
                          return (
                            <td
                              key={cellEl.id}
                              className={styles[cellEl.column.id]}
                            >
                              <span>
                                {flexRender(
                                  cellEl.column.columnDef.cell,
                                  cellEl.getContext()
                                )}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              )
            }
          </table>
        )}
      </div>
      {isDataAvailable && isPaginated && (
        <TableFooter
          getCanPreviousPage={getCanPreviousPageServer || getCanPreviousPage}
          getCanNextPage={getCanNextPageServer || getCanNextPage}
          previousPage={previousPageServer || previousPage}
          nextPage={nextPageServer || nextPage}
          setPageIndex={setPageIndexServer || setPageIndex}
          pageIndex={pageIndexServer || pageIndex}
          setPageSize={setPageSizeServer || setPageSize}
          pageSize={pageSizeServer || pageSize}
          getPageCount={getPageCountServer || getPageCount}
        />
      )}
      {!isDataAvailable && !loading && (
        <div className={styles.empty_data}>
          <EmptyData />
        </div>
      )}
    </div>
  );
};

export default Table;
