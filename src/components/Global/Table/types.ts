import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
} from "@tanstack/react-table";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  useHeader?: boolean;
  headerTitle?: string;
  loading?: boolean;
  countText?: string;
  tableProps?:
    | {
        filters?: ColumnFiltersState;
        search?: string;
        columnFilter?: ColumnFilter[];
        columnVisibility?: { [key: string]: boolean };
        isSorted?: boolean;
        sortedColumns?: string[];
        isPaginated?: "local";
        serverPagination?: {
          totalData: number;
          pageIndex: number;
          pageSize: number;
          setPageIndex: (page: number) => void;
          setPageSize: (page: number) => void;
        };
      }
    | {
        filters?: ColumnFiltersState;
        search?: string;
        columnFilter?: ColumnFilter[];
        columnVisibility?: { [key: string]: boolean };
        isSorted?: boolean;
        sortedColumns?: string[];
        isPaginated?: "server";
        serverPagination: {
          totalData: number;
          pageIndex: number;
          pageSize: number;
          setPageIndex: (page: number) => void;
          setPageSize: (page: number) => void;
        };
      };
}
export type GetServerPaginationProps = {
  isPaginated?: "local" | "server";
  serverPagination?: {
    totalData: number;
    pageIndex: number;
    pageSize: number;
    setPageIndex: (page: number) => void;
    setPageSize: (page: number) => void;
  };
};

export type TableColumn<T extends Record<string, any>> = ColumnDef<T>;

export interface GetColumnsWithHeader {
  columns: ColumnDef<any>[];
  totalData: number;
  headerTitle?: string;
  countText?: string;
}
