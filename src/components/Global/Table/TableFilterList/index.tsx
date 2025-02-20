import styles from "./_styles.module.scss";
import { SelectedFilters } from "components/Global/FilterCustom/types";
import { BiX } from "react-icons/bi";

const TableFilterList= (props: {filters: SelectedFilters,  removeFilter: (key: string)=> void }) => {

    return (
        <div className={styles.container}>
            {
              Object.entries(props.filters)?.map(([key, value], i)=> {
                return (
                  !value || (typeof value ==="string" && value.length<1) || (typeof value === 'object' && Object.keys(value).length === 0)?
                  null
                  :
                  <button key={i} onClick={()=> props.removeFilter(key)}>
                    <BiX color="black" size={24} />
                    {
                      key==="dates"? `${value.startDate} to ${value.endDate}` : value      
                    }
                  </button>
                )
              })
            }
        </div>
    )
}

export default TableFilterList;