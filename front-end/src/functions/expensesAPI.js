import axios from "axios"

export const getExpenses = async (year, month) => {
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

export const postExpense = async (data) => {
    try {
        const response = await axios.post(
            `/api/add-expense/${window.localStorage.getItem("email")}`, 
            data
        )

        const newId = response.data
        data._id = newId

        return data
    } catch (error) {
        console.log(error)
    }
}

export const putExpense = async (data) => {
    try {
        // The data parameter looks like this:
        // data: {
        //     id: expense id, 
        //     field: name of field, 
        //     newValue: new value of field
        // }
        await axios.put(`/api/update-expense/${window.localStorage.getItem("email")}`, data )
    } catch (error) {
        console.log(error)
    }
}

export const deleteExpense = async (expenseId) => {
    try {
        await axios.delete(
            `/api/remove-expense/${window.localStorage.getItem("email")}`, 
            { data: { id: expenseId } } 
        )
    } catch (error) {
        console.log(error)
    }
}