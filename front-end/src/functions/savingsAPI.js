import axios from "axios"

export const getSavings = async (year, month) => {
    try {
        const response = await axios.get(
            `/api/savings/${window.localStorage.getItem("email")}/?datatype=saving&year=${year}&month=${month}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getPrevSavings = async (year, month) => {
    try {
        const response = await axios.get(
            `/api/prev-savings/${window.localStorage.getItem("email")}/?datatype=saving&year=${year}&month=${month}`
        )
        console.log("From saving request: ",response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const postSaving = async (newSaving, year, month) => {
    try {
        // Adding the curr month and year to the category obj
        newSaving.month = month
        newSaving.year = year

        const response = await axios.post(
            `/api/add-saving/${window.localStorage.getItem("email")}/?datatype=saving`, 
            newSaving
        )

        console.log(response.data)

        // Got the ids from the API after inserting the saving
        const newIds = response.data

        // Setting the ids to the newCat
        newSaving.saving_id =  newIds.saving_id
        newSaving.details_id = newIds.details_id

        return newSaving
    } catch (error) {
        console.log(error)
    }
}

export const putSaving = async (saving, field, newVal) => {
    try {
        // Adding the curr month and year to the category obj
        let data = {
            obj_id: saving.saving_id,
            details_id: saving.details_id,
            field: field,
            newValue: newVal,
        }

        const response = await axios.put(
            `/api/update-saving/${window.localStorage.getItem("email")}/?datatype=saving`, 
            data
        )

        // Got the ids from the API after inserting the saving
        const newId = response.data

        return field === "name" ? newId : null
    } catch (error) {
        console.log(error)
    }
}

export const deleteSaving = async (ids) => {
    try {
        await axios.delete(
            `/api/remove-saving/${window.localStorage.getItem("email")}/?datatype=saving`, 
            { data: ids }
        )
    } catch (error) {
        console.log(error)
    }
}