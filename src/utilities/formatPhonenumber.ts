export const formatPhoneNumber = (phoneNumber: string): string => {
	// Remove spaces and the country code (+234), and replace it with '0'
	return phoneNumber.replace("+234", "0");
};
