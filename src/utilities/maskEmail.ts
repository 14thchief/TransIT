export const maskEmail = (email: string) => {
	const [localPart, domainPart] = email.split("@");
	if (localPart.length <= 2) {
		return `${localPart[0]}*${domainPart}`;
	}
	const maskedLocalPart =
		localPart[0] + "*".repeat(localPart.length - 3) + localPart.slice(-2);
	return `${maskedLocalPart}@${domainPart}`;
};
