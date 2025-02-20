// import { getCurrencySymbol } from "components/Global/Table/utils";
// import { useMemo } from "react";
// import { useGetCurrenciesQuery } from "src/redux/features/util/lovSlice";
import defaultCurrencies from "src/constants/currencySymbols.json";

const useGetCurrencies = () => {
	// const { data } = useGetCurrenciesQuery();
	// const currencies = useMemo(() => {
	// 	const fmtData = data?.map((item)=> ({
	// 		...item,
	// 		symbol: getCurrencySymbol(item.code)
	// 	}));

	// 	const seen = new Set();
	// 	return fmtData?.filter(item => {
	// 		if (item.code && !seen.has(item.code)) {
	// 			seen.add(item.code);
	// 			return true;
	// 		}
	// 		return false;
	// 	});
	// }, [data]);

	return defaultCurrencies;
};

export default useGetCurrencies;
