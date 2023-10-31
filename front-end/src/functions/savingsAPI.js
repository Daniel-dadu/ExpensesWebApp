import axios from "axios"

export const getSavings = async (year, month) => {
    try {
        const response = await axios.get(
            `/api/savings/${window.localStorage.getItem("email")}/?year=${year}&month=${month}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}