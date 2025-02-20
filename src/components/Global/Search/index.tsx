import { Close, Search as SearchIcon } from "src/assets/icons/icons";
import styles from "./_styles.module.scss";

type SearchInputProps = {
	placeholder?: string;
	searchText?: string;
	onSearch?: (searchText: string) => void;
	width?: "full" | "fit";
};

const Search: React.FC<SearchInputProps> = ({
	placeholder = "Search",
	searchText = "",
	width = "fit",
	onSearch,
}) => {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		onSearch && onSearch(value);
	};

	return (
		<div className={`${styles.search_input} ${styles[width]}`}>
			<SearchIcon size={25} className={styles.icon} />
			<input
				value={searchText}
				placeholder={placeholder}
				onChange={handleInputChange}
			/>
			{searchText && onSearch && (
				<Close
					size={16}
					className={styles.close}
					onClick={() => onSearch("")}
				/>
			)}
		</div>
	);
};

export default Search;
