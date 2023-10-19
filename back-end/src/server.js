import express from "express"
import { MongoClient } from "mongodb"

const app = express()

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "./env.js"

const url = mongo
const client = new MongoClient(url)

app.get("/api/expenses", async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    const expenses = await db.collection("expenses").find({}).toArray()

    let list = expenses.filter((expense) => 
        new Date(expense.date).getFullYear() == year && new Date(expense.date).getMonth() == month
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