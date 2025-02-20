import { ColumnFilter } from "@tanstack/react-table";
import { TableFilters } from "components/Global/Filter/types";
import { useState } from "react";

export const useFilters = (filters: TableFilters[]) => {
  const [selectedGroup, setSelectedGoup] = useState<ColumnFilter[]>([]);

  const addFilter = (filter: ColumnFilter, replace?: boolean): void => {
    let newSelectedGroup = [...selectedGroup];

    if (replace) {
      newSelectedGroup = selectedGroup.filter(
        (selected) => filter.id !== selected.id
      );
    }

    setSelectedGoup([...newSelectedGroup, filter]);
  };

  const removeFilter = (filter: ColumnFilter): void => {
    const newSelectedGroup = selectedGroup.filter(
      (selected) => filter.id !== selected.id || filter.value !== selected.value
    );
    setSelectedGoup(newSelectedGroup);
  };

  const clearFilter = () => {
    setSelectedGoup([]);
  };

  return {
    filters,
    selectedGroup,
    addFilter,
    removeFilter,
    clearFilter,
  };
};
