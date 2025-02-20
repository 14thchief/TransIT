export function sortAndCapitalize(strings: string[]) {
	// Convert strings to lowercase for sorting
	const sortedLowerCase = strings.map((str) => str.toLowerCase()).sort();

	// Capitalize the first letter of each string
	return sortedLowerCase.map((str) =>
		str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		})
	);
}