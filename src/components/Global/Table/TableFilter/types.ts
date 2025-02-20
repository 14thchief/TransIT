import { TableFilters } from "components/Global/Filter/types";
import { ReactNode } from "react";

export interface TableFilterProps {
  useSearch?: boolean;
  useFilter?: boolean;
  filters?: TableFilters[];
  searchText?: string;
  onSearch?: (searchText: string) => void;
  reverse?: boolean;
  replaceFiltersOnCheck?: boolean;
  customFilter?: ReactNode;
}
