import { MongoClient, ObjectId } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getIncomes = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    
    const email = req.params.email
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)+1

    const incomes = await db.collection("incomes").aggregate([
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
                source: 1,
                amount: 1,
            }
        }
      ]).toArray()

    res.json(incomes)
}

const addIncome = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const newIncome = req.body

    try {
        const result = await db.collection("incomes").insertOne(newIncome)
        
        if (result.insertedId) {
            res.json(result.insertedId)
        } else {
            res.status(404).json("Insertion of income failed")
        }
    } catch(error) {
        res.status(500).json(error)
    }

}

const updateIncome = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const incomeId = req.body.id
    const fieldToUpdate = req.body.field
    const newFieldVal = req.body.newValue

    console.log("Updating Expense")

    try {
        const result = await db.collection("incomes").updateOne(
            { _id: new ObjectId(incomeId) }, // ID of document to update
            { $set: { 
                [fieldToUpdate]: newFieldVal, // changing new value
            } } 
        )

        if (result.matchedCount === 1) {
            res.json("Income updated successfully")
        } else {
            res.status(404).json("Income not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }

}

const removeIncome = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const incomeId = req.body.id

    try {
        const result = await db.collection("incomes").deleteOne({
            _id: new ObjectId(incomeId)
        })
        if (result.deletedCount === 1) {
            res.json("Income deleted successfully")
        } else {
            res.status(404).json("Income not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getIncomes,
    addIncome,
    updateIncome,
    removeIncome,
}