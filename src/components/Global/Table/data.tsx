import { GetColumnsWithHeader, GetServerPaginationProps } from "./types";
import styles from "./_styles.module.scss";
import pluralize from "pluralize";

export const getServerPagination = ({
  isPaginated,
  serverPagination,
}: GetServerPaginationProps) => {
  let getCanPreviousPageServer;
  let getCanNextPageServer;
  let previousPageServer;
  let nextPageServer;
  let setPageIndexServer;
  let pageIndexServer;
  let pageSizeServer;
  let setPageSizeServer;
  let getPageCountServer;

  if (isPaginated === "server" && !!serverPagination) {
    getCanPreviousPageServer = () => serverPagination.pageIndex > 0;

    getCanNextPageServer = () =>
      serverPagination.pageIndex + 1 <
      Math.ceil(serverPagination.totalData / serverPagination.pageSize);

    previousPageServer = () =>
      serverPagination.setPageIndex(serverPagination.pageIndex - 1);

    nextPageServer = () =>
      serverPagination.setPageIndex(serverPagination.pageIndex + 1);

    setPageIndexServer = serverPagination.setPageIndex;

    pageIndexServer = serverPagination.pageIndex;

    pageSizeServer = serverPagination.pageSize;

    setPageSizeServer = serverPagination.setPageSize;

    getPageCountServer = () =>
      Math.ceil(serverPagination.totalData / serverPagination.pageSize);
  }

  return {
    getCanPreviousPageServer,
    getCanNextPageServer,
    previousPageServer,
    nextPageServer,
    setPageIndexServer,
    pageIndexServer,
    pageSizeServer,
    setPageSizeServer,
    getPageCountServer,
  };
};

// Util function to remove 'All' from any title
export const removeWordAll = (inputString:string) => {
  const isMobile = window.innerWidth <= 720;
  // Using regular expression to replace "All" or "all" with an empty string
  return !isMobile? inputString.replace(/\b(?:All|all)\b/g, '')?.trim() : inputString.replace(/\b(?:All|all|Filtered|filtered)\b/g, '')?.trim() ;
}

export const getColumnsWithHeader = ({
  columns,
  totalData,
  headerTitle,
  countText,
}: GetColumnsWithHeader) => {
  return [
    {
      id: "Title",
      header: () => {
        const pluralizedTitle =
          totalData !== 1
            ? pluralize(headerTitle? removeWordAll(headerTitle) : "Item")
            : headerTitle || "Item";
        return (
          <th colSpan={columns.length}>
            <div className={styles.header}>
              <h3>
                {pluralize(headerTitle || "Item")}
                {
                  countText?
                  <span className={styles.tableCount}>
                    <span>{countText}</span>
                  </span>
                  :
                  <span className={styles.tableCount}>
                    <span>{totalData}</span>
                    {pluralizedTitle}
                  </span>
                }
              </h3>
            </div>
          </th>
        );
      },
      columns,
      enableSorting: false,
    },
  ];
};
