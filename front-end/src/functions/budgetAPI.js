import axios from "axios"

export const getBudgets = async (year, month) => {
    try {
        const response = await axios.get(
            `/api/budget/${window.localStorage.getItem("email")}/?year=${year}&month=${month}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const postBudget = async (newBudget, year, month) => {
    try {
        // Adding the curr month and year to the category obj
        newBudget.month = month
        newBudget.year = year

        const response = await axios.post(
            `/api/add-budget/${window.localStorage.getItem("email")}`, 
            newBudget
        )

        // Got the ids from the API after inserting the budget
        const newIds = response.data

        // Setting the ids to the newCat
        newBudget.budget_id =  newIds.budget_id
        newBudget.details_id = newIds.details_id

        return newBudget
    } catch (error) {
        console.log(error)
    }
}

export const deleteBudget = async (ids) => {
    try {
        await axios.delete(
            `/api/remove-budget/${window.localStorage.getItem("email")}`, 
            { data: ids }
        )
    } catch (error) {
        console.log(error)
    }
}