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

app.get("/api/budget", (req, res) => {
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    const budgets = expenses.budget

    const listIDAndLimit = expenses.budgetDetails.filter((budgetD) => 
        budgetD.year === year && budgetD.month === month
    ).map((budgetD) => ({id: budgetD.budgetId, limit: budgetD.limit}))

    let list = listIDAndLimit.map(({ id, limit }) => 
        ({ name: budgets.find(b => b._id === id).name, limit })
    )

    res.json(list)
})

// TODO: Implement the logic to get the years (Issue #21)
app.get("/api/years", (req, res) => {
    res.json([2023, 2024, 2025])
})

app.listen(8000, () => {
    console.log("Server is listening on port 8000")
})