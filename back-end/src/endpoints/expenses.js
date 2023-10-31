import { MongoClient, ObjectId } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getExpenses = async (req, res) => {
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
                _id: 1,
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
}

const addExpense = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const newExpense = req.body

    try {
        const result = await db.collection("expenses").insertOne(newExpense)
        
        if (result.insertedId) {
            res.json(result.insertedId)
        } else {
            res.status(404).json("Expense not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }

}

const updateExpense = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const expenseId = req.body.id
    const fieldToUpdate = req.body.field
    const newFieldVal = req.body.newValue

    console.log("Updating Expense")

    try {
        const result = await db.collection("expenses").updateOne(
            { _id: new ObjectId(expenseId) }, // ID of document to update
            { $set: { 
                [fieldToUpdate]: newFieldVal, // changing new value
                updatedAt: new Date().toJSON(), // Update the date
            } } 
        )

        if (result.matchedCount === 1) {
            res.json("Expense updated successfully")
        } else {
            res.status(404).json("Expense not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }

}

const removeExpense = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const expenseId = req.body.id

    try {
        const result = await db.collection("expenses").deleteOne({
            _id: new ObjectId(expenseId)
        })
        if (result.deletedCount === 1) {
            res.json("Expense deleted successfully")
        } else {
            res.status(404).json("Expense not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getExpenses,
    addExpense,
    updateExpense,
    removeExpense,
}