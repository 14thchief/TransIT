export const extractValues = (data: { value: string }[]): string[] => {
	return data.map((item) => item.value);
};
