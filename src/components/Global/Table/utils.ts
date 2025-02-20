import { ColumnFilter } from "@tanstack/react-table";

type FlatFilterType = { id: string; values: unknown[] }[];

export const isRowIncluded = <T extends { [key: string]: any }>(
  row: T,
  filters: FlatFilterType
) => {
  let isIncluded = true;

  filters.forEach((filter) => {
    if (!filter.values.includes(row[filter.id])) {
      isIncluded = false;
    }
  });

  return isIncluded;
};

type InputType = ColumnFilter[];

export const flatenFilters = (inputArray: InputType): FlatFilterType => {
  const resultMap = new Map<string, unknown[]>();

  for (const item of inputArray) {
    const { id, value } = item;

    if (!resultMap.has(id)) {
      resultMap.set(id, [value]);
    } else {
      resultMap.get(id)?.push(value);
    }
  }

  return Array.from(resultMap.entries()).map(([id, values]) => ({
    id,
    values,
  }));
};
