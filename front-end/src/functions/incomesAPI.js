import axios from "axios"

export const getIncomes = async (year, month) => {
    try {
        const response = await axios.get(
            `/api/incomes/${window.localStorage.getItem("email")}/?year=${year}&month=${month}`
        )
        
		// Turning all the date strings into Date
        return response.data.map((income) => { 
			return {...income, "date": new Date(income.date)} 
		})

    } catch (error) {
        console.log(error)
    }
}

export const postIncome = async (data) => {
    try {
        const response = await axios.post(
            `/api/add-income/${window.localStorage.getItem("email")}`, 
            data
        )

        const newId = response.data
        data._id = newId

        return data
    } catch (error) {
        console.log(error)
    }
}

export const putIncome = async (data) => {
    try {
        // The data parameter looks like this:
        // data: {
        //     id: income id, 
        //     field: name of field, 
        //     newValue: new value of field
        // }
        await axios.put(`/api/update-income/${window.localStorage.getItem("email")}`, data )
    } catch (error) {
        console.log(error)
    }
}

export const deleteIncome = async (incomeId) => {
    try {
        await axios.delete(
            `/api/remove-income/${window.localStorage.getItem("email")}`, 
            { data: { id: incomeId } } 
        )
    } catch (error) {
        console.log(error)
    }
}