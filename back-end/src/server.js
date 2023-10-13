import express from "express"
import { expenses } from "./expenses-obj"

const app = express()

app.get("/api/expenses", (req, res) => {
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    let list = expenses.list.filter((expense) => 
        expense.date.getFullYear() == year && expense.date.getMonth() == month
    )

    res.json(list)
})

app.get("/api/categories", (req, res) => {
    res.json(expenses.categories)
})

// TODO: Implement the logic to get the years (Issue #21)
app.get("/api/years", (req, res) => {
    res.json([2023, 2024])
})

app.listen(8000, () => {
    console.log("Server is listening on port 8000")
})