import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import styles from "./_styles.module.scss";

// import PropTypes from "prop-types";
type DateRangeType = {
	startDate: Date;
	endDate: Date;
	key?: string;
};

export interface PropRangeType {
	startDate?: Date;
	endDate?: Date;
}

const DateRangeSelector = (props: {
	value: PropRangeType;
	onChange: (range: PropRangeType) => void;
}) => {

	const range = {
		startDate: props.value.startDate,
		endDate: props.value.endDate,
		key: "selection",
	};

	function handleOnChange(selection: DateRangeType) {
		// setState(selection);
		props.onChange({
			startDate: selection.startDate,
			endDate: selection.endDate,
		});
	}

	return (
		<DateRange
			onChange={(item) => handleOnChange(item.selection as DateRangeType)}
			moveRangeOnFirstSelection={false}
			months={1}
			ranges={[range]}
			direction="vertical"
			maxDate={new Date()}
			className={styles.dateRangePickerWrapper}
			classNames={{
				month: styles.month,
				monthAndYearWrapper: styles.monthAndYearWrapper,
				// dateDisplay: styles.dateDisplay,
			}}
			startDatePlaceholder="Start Date"
			endDatePlaceholder="End Date"
			retainEndDateOnFirstSelection
			// showPreview={false}
			rangeColors={["#0085ff"]}
		/>
	);
};

export default DateRangeSelector;
