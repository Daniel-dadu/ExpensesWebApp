import axios from "axios"

export const getPrevExpensesTotal = async (year, month) => {
	try {
		const response = await axios.get(
			`/api/summary-prev-expenses/${window.localStorage.getItem("email")}/?year=${year}&month=${month}`
		)

		console.log(response.data)
		
		return response.data.totalAmount
	} catch (error) {
		console.log(error)
	}
}

export const getPrevSavedTotal = async (year, month) => {
	try {
		const response = await axios.get(
			`/api/summary-prev-saved/${window.localStorage.getItem("email")}/?year=${year}&month=${month}`
		)

		console.log(response.data)
		
		return response.data.totalAmount
	} catch (error) {
		console.log(error)
	}
}