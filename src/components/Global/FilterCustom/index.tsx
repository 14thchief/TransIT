import React, { RefObject, useEffect, useState } from "react";
import { FilterCustomPropType, FilterType } from "./types";
import { Filter as FilterIcon } from "src/assets/icons/icons";
import useClickOutside from "src/hooks/useClickOutside";
import styles from "./_styles.module.scss";
import Button from "components/Core/Button";
import DateRangeSelector from "components/Core/FormElements/DateRangeSelector";
import { format } from "date-fns";
import useGetWindowDimension from "src/hooks/useGetWindowDimension";


const FilterCustom: React.FC<FilterCustomPropType> = ({ filters, onApplyFilter }) => {
  const [filterState, setFilterState] = useState<{[key: string]: any }>({});
  const { isMobile } = useGetWindowDimension();
  const { open, setOpen, dropdownRef } = useClickOutside();

  useEffect(()=> {
    filters.forEach((item)=> {
      // if (item.selectedOption) {
        setFilterState(prev=> ({
          ...prev,
          [item.groupID]: item.selectedOption
        }))
      // }
    })
  }, [filters])

  const handleSubmitFilter= ()=> {
    onApplyFilter(filterState);
    handleToggleDropdown();
    // setFilterState({});
  }
  
  const handleToggleDropdown = () => {
    setOpen(!open);
  };

  const getInputComponent= (item:FilterType, index?:number)=> {
    switch (item.type) {
      case "select": return (
        <div key={index} className={styles.filterGroup}>
          <p>{item.groupID}</p>
          <select
            className={styles.dropdown}
            onChange={({ target: { value }})=> setFilterState(prev=> ({
              ...prev, 
              [item.groupID]: value 
            }))}
            value={filterState[item.groupID]}
          >
            <option value={''}>All</option>
            {
              item.options?.map((opt, i)=> {
                return <option key={i} value={opt.value}>{opt.label}</option>
              })
            }          
          </select>
        </div>
      )

      case "date": return (
        <div key={index} className={styles.filterGroup}>
          <p>{item.groupID}</p>
          <div className={styles.dateRangeWrapper}>
            <DateRangeSelector 
              value={ 
                filterState[item.groupID]??
                {
                  startDate: format(new Date(), "dd/MM/yyyy"),
                  endDate: format(new Date(), "dd/MM/yyyy"),
                }
              }
              onChange={(value)=> setFilterState(prev=> ({
                ...prev, 
                [item.groupID]: value 
              }))}
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div
      ref={dropdownRef as RefObject<HTMLDivElement>}
      className={styles.dropdown_filter}
    >
      <Button
        text={!isMobile? "Filter":""}
        variant={"grey"}
        width={"fit"}
        size={"small"}
        icon={<FilterIcon size={24} />}
        onClick={handleToggleDropdown}
      />

      {filters.length > 0 && open && (
        <div
          className={`${styles.content} ${open ? styles.active : ""}`}
        >
          {filters.map((item, index)=> {
            return (
              getInputComponent(item, index)
            )
          })}
          <Button text={"Apply Filter"} onClick={handleSubmitFilter} />
        </div>
      )}
    </div>
  );
};

export default FilterCustom;
