import { useEffect, useState } from "react";

const useSessionStorage = <T>(key: string): T | null => {
	const [value, setValue] = useState<T | null>(null);

	useEffect(() => {
		const item = sessionStorage.getItem(key);
		setValue(item ? (JSON.parse(item) as T) : null);
	}, [key]);

	return value;
};

export default useSessionStorage;
