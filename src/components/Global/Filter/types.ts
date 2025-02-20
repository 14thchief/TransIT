import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";

export type TableFilters = ColumnFilter & { label: string };

export interface DropdownFilterButtonProps {
  filters: TableFilters[];
  selectedGroup: ColumnFiltersState;
  addFilter: (filter: ColumnFilter, replace?: boolean) => void;
  clearFilter: () => void;
  removeFilter: (filter: ColumnFilter) => void;
  reverse?: boolean;
  replaceFiltersOnCheck?: boolean;
}
