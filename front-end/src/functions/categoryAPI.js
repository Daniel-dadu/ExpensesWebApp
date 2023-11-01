import axios from "axios"

export const getCategories = async (categType, year, month) => {
    try {
        const response = await axios.get(
            `/api/${categType}s/${window.localStorage.getItem("email")}/?datatype=${categType}&year=${year}&month=${month}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getPrevCategories = async (categType, year, month) => {
    try {
        const response = await axios.get(
            `/api/prev-${categType}s/${window.localStorage.getItem("email")}/?datatype=${categType}&year=${year}&month=${month}`
        )
        console.log("From ${categType} request: ",response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const postCategory = async (categType, newCategory, year, month) => {
    try {
        // Adding the curr month and year to the category obj
        newCategory.month = month
        newCategory.year = year

        const response = await axios.post(
            `/api/add-${categType}/${window.localStorage.getItem("email")}/?datatype=${categType}`, 
            newCategory
        )

        console.log(response.data)

        // Got the ids from the API after inserting the category
        const newIds = response.data

        // Setting the ids to the newCat
        newCategory.category_id = newIds.category_id
        newCategory.details_id = newIds.details_id

        return newCategory
    } catch (error) {
        console.log(error)
    }
}

export const putCategory = async (categType, category, field, newVal) => {
    try {
        // Adding the curr month and year to the category obj
        let data = {
            category_id: category.category_id,
            details_id: category.details_id,
            field: field,
            newValue: newVal,
        }

        const response = await axios.put(
            `/api/update-${categType}/${window.localStorage.getItem("email")}/?datatype=${categType}`, 
            data
        )

        // Got the ids from the API after inserting the category
        const newId = response.data

        return field === "name" ? newId : null
    } catch (error) {
        console.log(error)
    }
}

export const deleteCategory = async (categType, ids) => {
    try {
        await axios.delete(
            `/api/remove-${categType}/${window.localStorage.getItem("email")}/?datatype=${categType}`, 
            { data: ids }
        )
    } catch (error) {
        console.log(error)
    }
}