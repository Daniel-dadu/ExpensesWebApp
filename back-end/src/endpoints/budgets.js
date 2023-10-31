import { MongoClient, ObjectId } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getBudgets = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const email = req.params.email
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    let budgets = await db.collection("budgets").aggregate([
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
                _id: 1,
                details_id: "$budgetDetails._id",
                name: 1,
                limit: "$budgetDetails.limit",
            }
        },
    ]).toArray()

    // Renaming the _id property
    budgets = budgets.map(budget => {
        Object.defineProperty(budget, "budget_id",
            Object.getOwnPropertyDescriptor(budget, "_id"))
        delete budget["_id"]
        return budget
    })

    res.json(budgets)
}

const getPrevBudgets = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const userId = req.params.userId
    let year = parseInt(req.query.year)
    let month = parseInt(req.query.month)-1

    if(month === -1) {
        month = 11
        --year
    }

    // Get the array of budgets
    let budgets = await db.collection('budgets').aggregate([
        {
            $match: {
                userId: userId,
            },
        },
        {
            $lookup: {
                from: 'budget_details',
                localField: '_id',
                foreignField: 'budgetId',
                as: 'budgetDetails',
            },
        },
        {
            $unwind: '$budgetDetails',
        },
        {
            $match: {
                'budgetDetails.month': month,
                'budgetDetails.year': year,
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                limit: '$budgetDetails.limit',
            },
        },
    ]).toArray()

    month++

    if(month === 12) {
        month = 0
        ++year
    }

    budgets.map(async (budget) => {
        const specificDetails = await db.collection("budget_details").insertOne({
            budgetId: new ObjectId(budget._id),
            limit: budget.limit,
            month: month,
            year: year,
        })
        if(specificDetails.insertedId) {
            budget.details_id = specificDetails.insertedId
        } else {
            res.status(404).json("Could not insert specific budget/category")
        }

        // Renaming the _id property
        Object.defineProperty(budget, "budget_id",
            Object.getOwnPropertyDescriptor(budget, "_id"))
        delete budget["_id"]

        return budget
    })

    res.json(budgets)
}

const addBudget = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    const userId = req.params.userId
    const name = req.body.name
    const month = req.body.month
    const year = req.body.year

    try {
        let budgetId = ""
        
        // First verify that the user doesn't have another budget with that name
        const budget_exists = await db.collection("budgets").find({
            userId: userId,
            name: name,
        }).toArray()

        // If there is no budget with that name for that user, create it
        if (budget_exists.length === 0) {
            const budget = await db.collection("budgets").insertOne({
                userId: userId,
                name: name,
                createdAt: new Date().toJSON()
            })

            if(budget.insertedId) {
                budgetId = budget.insertedId
            } else {
                res.status(404).json("ERR 1: Could not insert budget/category")
                return
            }
        } else {
            budgetId = budget_exists[0]._id
        }
        
        const specificDetails = await db.collection("budget_details").insertOne({
            budgetId: new ObjectId(budgetId),
            limit: 0,
            month: month,
            year: year,
        })
        if(specificDetails.insertedId) {
            res.json({
                budget_id: budgetId,
                details_id: specificDetails.insertedId,
            })
        } else {
            res.status(404).json("ERR 2: Could not insert specific budget/category")
        }
    } catch(error) {
        res.status(500).json(error)
    }
}

const updateBudget = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    const userId = req.params.userId
    let budgetId = req.body.budget_id
    const budgetDetailsId = req.body.details_id
    const fieldToUpdate = req.body.field
    const newFieldVal = req.body.newValue

    console.log("Updating Budget")

    if(fieldToUpdate === "limit") {
        try {
            const result = await db.collection("budget_details").updateOne(
                { _id: new ObjectId(budgetDetailsId) }, // ID of document to update
                { $set: { 
                    [fieldToUpdate]: newFieldVal, // changing new value
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

    else if (fieldToUpdate === "name") {
        try {
            const budget = await db.collection("budgets").insertOne({
                userId: userId,
                name: newFieldVal,
                createdAt: new Date().toJSON()
            })

            if(budget.insertedId) {
                budgetId = budget.insertedId

                const result = await db.collection("budget_details").updateOne(
                    { _id: new ObjectId(budgetDetailsId) }, // ID of document to update
                    { $set: { 
                        ["budgetId"]: budgetId, // changing new value
                    } } 
                )
        
                if (result.matchedCount === 1) {
                    res.json(budgetId) // Returning the new budget_id for that budget
                } else {
                    res.status(404).json("Expense not found")
                }

            } else {
                res.status(404).json("Could not insert budget/category")
                return
            }

        } catch(error) {
            res.status(500).json(error)
        }
    }

}

const deleteBudget = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId
    const budgetId = req.body.budget_id
    const detailsId = req.body.details_id

    let couldDeteleBudget = false

    try {
        const details_result = await db.collection("budget_details").deleteOne({
            _id: new ObjectId(detailsId)
        })
        if (details_result.deletedCount === 1) {
            // Check if the budget doesn't any details (it's not used in any month)
            const budgets = await db.collection("budget_details").find({
                budgetId: new ObjectId(budgetId)
            }).toArray()

            // If that budget is not used in any month, delete it from budgets collection
            if(budgets.length === 0) {
                const del_budget = await db.collection("budgets").deleteOne({
                    _id: new ObjectId(budgetId)
                })
                if(del_budget.deletedCount !== 1) {
                    res.status(404).json("Not used budget was not deleted correctly")
                    return
                } else {
                    couldDeteleBudget = true 
                }
            }

            res.json(`Budget (of that month) deleted successfully and ${couldDeteleBudget ? "also" : "didn't"} deleted the whole budget`)
        } else {
            res.status(404).json("Budget not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getBudgets,
    getPrevBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
}