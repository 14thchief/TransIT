import { TableFilterProps } from "./types";
import styles from "./_styles.module.scss";
import Filter from "components/Global/Filter";
import Search from "components/Global/Search";
import { useFilters } from "src/hooks/useFilters";

const TableFilter: React.FC<TableFilterProps> = ({
  useFilter = true,
  useSearch = true,
  filters = [],
  searchText,
  onSearch,
  reverse,
  replaceFiltersOnCheck,
  customFilter
}) => {
  const filterProps = useFilters(filters);

  return (
    <div className={`${styles.table_filter} ${reverse ? styles.reverse : ""}`}>
      {useFilter && filterProps && (
        customFilter??
        <Filter
          {...filterProps}
          reverse={reverse}
          replaceFiltersOnCheck={replaceFiltersOnCheck}
        />
      )}
      {useSearch && <Search searchText={searchText} onSearch={onSearch} />}
    </div>
  );
};

export default TableFilter;
