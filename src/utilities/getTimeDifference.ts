export const getTimeDifference = (date: string) => {
	const currentDate = new Date().getTime();
	const updatedDate = new Date(date).getTime();
	const timeDifference = currentDate - updatedDate;

	const seconds = Math.floor(timeDifference / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);

	if (years > 0) {
		return `${years} year${years > 1 ? "s" : ""} ago`;
	} else if (months > 0) {
		return `${months} month${months > 1 ? "s" : ""} ago`;
	} else if (days > 0) {
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else {
		return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
	}
};

export const formatCreatedDateNotifications = (date: string) => {
	const currentDate = new Date().getTime();
	const updatedDate = new Date(date).getTime();
	const timeDifference = currentDate - updatedDate;

	const seconds = Math.floor(timeDifference / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days >= 7) {
		// Return the date in dd-mm-yy format
		const formattedDate = new Date(updatedDate);
		const day = String(formattedDate.getDate()).padStart(2, "0");
		const month = String(formattedDate.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
		const year = String(formattedDate.getFullYear()).slice(-2); // Get last two digits of the year

		return `${day}-${month}-${year}`;
	}

	if (days > 0) {
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else {
		return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
	}
};
