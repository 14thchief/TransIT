export const validatePassword = (password: string) => {
	if (!/[A-Z]/.test(password)) {
		return "Password must contain an upper case character.";
	}

	if (!/\d/.test(password)) {
		return "Password must contain a digit.";
	}

	if (!/\W/.test(password)) {
		return "Password must contain a non-alphanumeric character.";
	}

	if (password.length < 8) {
		return "Password' must be a minimum of 8 characters.";
	}

	return true;
};
