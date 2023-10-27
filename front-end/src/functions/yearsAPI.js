import axios from "axios"

export const getYears = async () => {
    try {
        const response = await axios.get(
            `/api/years/${window.localStorage.getItem("email")}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
} 