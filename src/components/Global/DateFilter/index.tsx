import DatePicker from "react-datepicker";
import styles from "./styles.module.scss";

import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

type DateFilterProps = {
  onChange: (date: Date|null) => void;
  date?: Date|null;
}

const DateFilter = ({onChange, date: controlDate}: DateFilterProps) => {
  const [date, setDate] = useState<Date|null>(null);

  return (
    <div className={styles.dateWrapper}>
        <DatePicker 
          selected={controlDate?? date} 
          placeholderText="Pick Date"
          isClearable
          clearButtonClassName={styles.clearButton}
          onChange={(date) => { 
            onChange(date);
            setDate(date);
          }}
          dateFormat="dd/MM/YY"
        />
    </div>
  );
};

export default DateFilter;