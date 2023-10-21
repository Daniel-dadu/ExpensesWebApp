import express from "express"
import { MongoClient } from "mongodb"

const app = express()
app.use(express.json())

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "./env.js"

const url = mongo
const client = new MongoClient(url)

app.get("/api/expenses/:email", async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    
    const email = req.params.email
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)+1

    const expenses = await db.collection("expenses").aggregate([
        {
            $addFields: {
                dateObj: {
                    $dateFromString: {
                        dateString: "$date",
                        format: "%Y-%m-%dT%H:%M:%S.%LZ"
                    }
                }
            }
        },
        {
            $match: {
                "userId": email,
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$dateObj" }, year] },
                        { $eq: [{ $month: "$dateObj" }, month] } 
                    ]
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: 1,
                category: 1,
                description: 1,
                amount: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
      ]).toArray()

    res.json(expenses)
})

app.get("/api/budget/:email", async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const email = req.params.email
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    const budgets = await db.collection("budgets").aggregate([
        {
            $lookup: {
                from: "budget_details",
                localField: "_id",
                foreignField: "budgetId",
                as: "budgetDetails"
            }
        },
        {
            $unwind: "$budgetDetails"
        },
        {
            $match: {
                "userId": email,
                "budgetDetails.month": month,
                "budgetDetails.year": year
            }
        },
        {
            $project: {
                name: 1,
                limit: "$budgetDetails.limit",
                _id: 0
            }
        },
    ]).toArray()

    res.json(budgets)
})

// TODO: Implement the logic to get the years (Issue #21)
app.get("/api/years/:email", async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const email = req.params.email

    const apiYears = await db.collection("expenses").aggregate([
        {
            $addFields: {
                year: { $year: { $dateFromString: { dateString: "$date" } } }
            }
        },
        {
            $match: {
                userId: email
            }
        },
        {
            $group: {
                _id: "$year"
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id"
            }
        }
    ]).toArray()

    let years = apiYears.map(y => y.year)
    const currYear = new Date().getFullYear()

    // Verify if the current year is in the list
    if(!years.includes(currYear)) {
        years.push(currYear)
    }

    res.json(years)
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