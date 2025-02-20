import { ReactElement } from "react";
import styles from "./_styles.module.scss";
import filterIcon from "src/assets/svg/filterIcon.svg";

type SelectFilterProps = {
	value: string;
	title?: string;
	onSelect?: (value: string) => void;
	width?: "full" | "fit";
	options?: string[];
	customFilter?: ReactElement;
	customClassName?: string;
};

const SelectFilter: React.FC<SelectFilterProps> = ({
	value,
	title,
	width = "fit",
	onSelect,
	options,
	customFilter,
	customClassName,
}) => {
	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;
		onSelect && onSelect(value);
	};

	return (
		<div className={`${styles.select_filter} ${styles[width]}`}>
			<img src={filterIcon} className={styles.icon} />
			<p className={styles.text}>{`Filter by ${title}`}</p>
			{customFilter?
				<div className={`${styles.inputWrapper} ${styles.customClassName && styles[customClassName as string]}`}>
				{customFilter}
				</div>
			: 
				<select className={styles.inputWrapper} value={value} onChange={handleSelectChange}>
				{
					options?.map((item, index)=> <option key={index} value={item}>{item}</option>)
				}
				</select>
			}
		</div>
	);
};

export default SelectFilter;
