import express from "express"
import { MongoClient } from "mongodb"

const app = express()
app.use(express.json())

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

app.get("/api/budget", async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    const budgets = await db.collection("budgets").find({}).toArray()
    
    const budget_details = await db.collection("budget_details").find({}).toArray()

    const listIDAndLimit = budget_details.filter((budgetD) => 
        budgetD.year === year && budgetD.month === month
    ).map((budgetD) => ({id: budgetD.budgetId.toString(), limit: budgetD.limit}))

    let list = listIDAndLimit.map(({ id, limit }) => 
        ({ name: budgets.find(b => b._id.toString() === id).name, limit })
    )

    res.json(list)
})

// TODO: Implement the logic to get the years (Issue #21)
app.get("/api/years", (req, res) => {
    res.json([2023, 2024, 2025])
})

app.post("/api/expenses/:userId", (req, res) => {
    const userId = req.params.userId
    const newExpense = req.body
    res.json("good")
})

const port = 8000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})