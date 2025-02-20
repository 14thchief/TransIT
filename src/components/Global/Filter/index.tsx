/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { RefObject } from "react";
import { DropdownFilterButtonProps, TableFilters } from "./types";
import { Filter as FilterIcon } from "src/assets/icons/icons";
import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import useClickOutside from "src/hooks/useClickOutside";
import styles from "./_styles.module.scss";
import Checkbox from "../Checkbox";
import Button from "components/Core/Button";

function groupByProperty<T extends Record<string, any>>(
  objects: T[],
  property: string,
  defaultValue: string = "default"
): Record<string, T[]> {
  return objects.reduce((grouped: Record<string, T[]>, obj: T) => {
    const key: string =
      obj[property] !== undefined ? String(obj[property]) : defaultValue;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(obj);

    return grouped;
  }, {});
}

const renderGroup = (
  filters: TableFilters[],
  title: string,
  selectedGroup: ColumnFiltersState,
  selectValue: (filter: ColumnFilter) => void
) => {
  return (
    <React.Fragment key={title}>
      <h3 className={styles.dropdown_filter}>{title}</h3>
      <ul className={styles.group_list}>
        {filters.map((item, index) => {
          const isChecked = !!selectedGroup.find(
            (seleceted: ColumnFilter) =>
              seleceted.id === item.id && seleceted.value === item.value
          );

          return (
            <li key={index} className={styles.content}>
              <input
                type="radio"
                checked={isChecked}
                onChange={() => selectValue(item)}
              />
              <label>{item.label}</label>
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

const Filter: React.FC<DropdownFilterButtonProps> = ({
  filters,
  selectedGroup,
  addFilter,
  removeFilter,
  clearFilter,
  reverse,
  replaceFiltersOnCheck,
}) => {
  const groupFilter = groupByProperty(filters, "id", "default");

  const { open, setOpen, dropdownRef } = useClickOutside();

  const handleToggleDropdown = () => {
    setOpen(!open);
  };

  const toggle = (isChecked: boolean, filter: ColumnFilter) => {
    if (isChecked) {
      addFilter(filter, replaceFiltersOnCheck);
    } else {
      removeFilter(filter);
    }
  };

  const selectValue = (filter: ColumnFilter) => {
    addFilter(filter, true);
  };

  return (
    <div
      ref={dropdownRef as RefObject<HTMLDivElement>}
      className={styles.dropdown_filter}
    >
      <Button
        text={"Filter"}
        variant={"grey"}
        width={"fit"}
        size={"small"}
        icon={<FilterIcon size={25} />}
        onClick={handleToggleDropdown}
      />

      {Object.entries(groupFilter).length > 0 && (
        <div
          className={`${styles.content} ${open ? styles.active : ""} ${
            reverse ? styles.reverse : ""
          }`}
        >
          {Object.entries(groupFilter).map(
            ([group, filterOptions], groupIndex) => {
              
              return group !== "default" ? (
                renderGroup(filterOptions, group, selectedGroup, selectValue)
              ) : (
                <ul key={groupIndex}>
                  {filterOptions.map((item, index) => {
                    const isChecked = !!selectedGroup.find(
                      (seleceted) =>
                        seleceted.id === item.id &&
                        seleceted.value === item.value
                    );

                    return (
                      <li key={index}>
                        <Checkbox
                          checked={isChecked}
                          label={item.label}
                          onToggle={(checked) => toggle(checked, item)}
                        />
                      </li>
                    );
                  })}
                </ul>
              );
            }
          )}
          <Button text={"Clear Filter"} onClick={clearFilter} />
        </div>
      )}
    </div>
  );
};

export default Filter;
