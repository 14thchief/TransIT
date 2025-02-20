import moment          from 'moment';

export const formatDate = (value?: string, format = 'DD-MMM-YYYY') => {
	if (!value) {
		return moment(new Date()).format(format);
	}
	return moment(value).format(format);
};

export function formatDateWithCustomFormat(
    dateString: string | Date, 
    format: string, 
    options?: {
        digitalFormat?: boolean,
        padDate?: boolean,
    }
): string {
    const date = new Date(dateString);
    const day = ("0" + (date.getUTCDate() + (options?.padDate? 1 : 0))).slice(-2);
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
	const { shortName } = getMonthObj(date.getUTCMonth()) || { shortName: "" };
    const year = date.getUTCFullYear();
    const hour = ("0" + (date.getUTCHours()+1)).slice(-2);
    const minute = ("0" + (date.getUTCMinutes()+1)).slice(-2);
    const seconds = ("0" + (date.getUTCSeconds()+1)).slice(-2);

    return format
        .replace("DD", day)
        .replace("MM", options?.digitalFormat? month : shortName)
        .replace("YYYY", year.toString())
        .replace("hh", hour)
        .replace("mm", minute)
        .replace("ss", seconds);
}

export function toISOLocal(d: Date) {
    const z  =( n: number )=>  ('0' + n).slice(-2);
    const zz =( n: number )=> ('00' + n).slice(-3);
    // let off = d.getTimezoneOffset();
    const sign = 'Z';
    // off = Math.abs(off);
  
    return d.getFullYear() + '-'
           + z(d.getMonth()+1) + '-' +
           z(d.getDate()) + 'T' +
           z(d.getHours()) + ':'  + 
           z(d.getMinutes()) + ':' +
           z(d.getSeconds()) + '.' +
           zz(d.getMilliseconds()) +
           sign; 
}

export const formatDateTime = (value?: string) => {
	if (!value) {
		return moment(new Date()).format('DD-MM-YYYY || h:mm a');
	}
	return moment(value).format('DD-MM-YYYY || h:mm a');
};

export const monthsOfYear = [
    { fullName: "January", shortName: "Jan" },
    { fullName: "February", shortName: "Feb" },
    { fullName: "March", shortName: "Mar" },
    { fullName: "April", shortName: "Apr" },
    { fullName: "May", shortName: "May" },
    { fullName: "June", shortName: "Jun" },
    { fullName: "July", shortName: "Jul" },
    { fullName: "August", shortName: "Aug" },
    { fullName: "September", shortName: "Sep" },
    { fullName: "October", shortName: "Oct" },
    { fullName: "November", shortName: "Nov" },
    { fullName: "December", shortName: "Dec" }
];

export function getMonthObj(index: number) {
    return monthsOfYear[index];
}

export function addOneDayToDate(today: Date) {
    const datePlusOne = new Date(today);
    datePlusOne.setDate(today.getDate() + 1);
    return datePlusOne;
}

export function removeOneDayFromDate(today: Date) {
    const datePlusOne = new Date(today);
    datePlusOne.setDate(today.getDate() - 1);
    return datePlusOne;
}
