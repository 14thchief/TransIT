export const formatCurrency = (number: number, currency?: string) => {
	const formatter = new Intl.NumberFormat(undefined, {
		currency: currency ? currency : "NGN",
		style: "currency",
		currencyDisplay: "narrowSymbol",
	});

	return formatter.format(number);
};

export const formatMoney = (amount: number, currencySign?: string) => {
	if (amount === null || amount === undefined) {
		return "0.00";
	}

	if (typeof amount !== "number") {
		const parsedNum = Number(amount);
		if (parsedNum) {
			return `${currencySign ?? "₦"}${parsedNum
				.toFixed(2)
				.replace(/\d(?=(\d{3})+\.)/g, "$&,")} `;
		} else {
			throw new Error("Input must be a number or parsable string");
		}
	}

	//Format to Money string
	return `${currencySign ?? "₦"}${amount
		.toFixed(2)
		.replace(/\d(?=(\d{3})+\.)/g, "$&,")} `;
};

export const formatNumber = (number: number, locale?: string) =>
	new Intl.NumberFormat(locale).format(number);
