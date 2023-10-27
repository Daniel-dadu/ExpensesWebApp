import axios from "axios"

export const requestExpenses = async (year, month) => {
    try {
        const response = await axios.get(
            `/api/expenses/${window.localStorage.getItem("email")}/?year=${year}&month=${month}`
        )
        
		// Turning all the date strings into Date
        return response.data.map((expense) => { 
			return {...expense, "date": new Date(expense.date)} 
		})

    } catch (error) {
        console.log(error)
    }
}