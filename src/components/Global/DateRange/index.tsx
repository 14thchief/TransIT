import { useState } from "react";
import styles from "./styles.module.scss";
import { MdCancel } from "react-icons/md";
import DateRangeSelector from "components/Core/FormElements/DateRangeSelector";
import { BiCalendar } from "react-icons/bi";

export type DateRangeProps = {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (val?: Date) => void;
  setEndDate: (val?: Date) => void;
  anchor?: "left" | "right";
};

const DateRange = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  anchor = "right",
}: DateRangeProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <label className={styles.dateFilter}>
      <div
        onClick={() => setShowDatePicker((prev) => !prev)}
        className={styles.dateRangeDisplay}
      >
        <BiCalendar size={18} color={startDate ? "#0085ff" : "#8C8C8C"} />
        <p>
          {startDate
            ? `${startDate.toLocaleDateString("en-GB")} to 
                    ${endDate?.toLocaleDateString("en-GB")}`
            : "Select Date Range"}
        </p>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setShowDatePicker(false);
            }}
          >
            <MdCancel color={"red"} />
          </button>
        )}
      </div>
      <div
        className={`
                    ${styles.datePickerWrapper}
                    ${showDatePicker && styles.active}
                    ${styles[anchor]}
                `}
        onMouseLeave={() => setShowDatePicker(false)}
      >
        <DateRangeSelector
          value={{
            startDate: startDate ?? new Date(),
            endDate: endDate ?? new Date(),
          }}
          onChange={(value) => {
            setStartDate(value.startDate);
            setEndDate(value.endDate);
          }}
        />
      </div>
    </label>
  );
};

export default DateRange;
