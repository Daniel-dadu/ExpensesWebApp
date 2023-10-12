/**
 * Gets a string representing a date.
 * Returns a string in format DD/MM/YYYY.
 */
export const formatDateForView = (date) => {
	const d = new Date(date)
	return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear()
}

/**
 * Gets a string representing a date.
 * Returns a string in format DD/MM/YYYY, HH:MM.
 */
export const formatDateWithHourForView = (date) => {
	const d = new Date(date)
	return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes()
}