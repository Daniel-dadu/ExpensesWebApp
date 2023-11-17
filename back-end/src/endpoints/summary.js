import { MongoClient } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getPrevExpenses = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    
    const email = req.params.email
    let year = parseInt(req.query.year)
    let month = parseInt(req.query.month)

    if(month === 0) {
        month = 12
        --year
    }

    const totalAmount = await db.collection("expenses").aggregate([
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
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
            },
        },
    ]).toArray()

    // res.json({ totalAmount: totalAmount})
    res.json({ totalAmount: (totalAmount.length === 0) ? 0 : totalAmount[0].totalAmount })
}

const getPrevSaved = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    
    const email = req.params.email
    let year = parseInt(req.query.year)
    let month = parseInt(req.query.month)

    if(month === 0) {
        month = 12
        --year
    }

    const savings_thresholds = await db.collection("saving_details").aggregate([
        {
            $match: {
                month,
                year,
            },
        }, {
            $lookup: {
                from: 'savings',
                localField: 'savingId',
                foreignField: '_id',
                as: 'saving',
            },
        }, {
            $unwind: '$saving',
        }, {
            $match: {
                'saving.userId': email,
            },
        }, {
            $project: {
                name: '$saving.name',
                threshold: '$threshold',
                _id: 0,
            },
        },
    ]).toArray()

    const savings_categories = savings_thresholds.map(i => i.name)

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
        }, {
            $match: {
                "userId": email,
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$dateObj" }, year] },
                        { $eq: [{ $month: "$dateObj" }, month] } 
                    ]
                }
            },
        }, {
            $match: {
                "category": { $in: savings_categories }
            }
        }, {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
            },
        },
    ]).toArray()

    const totalSaving = savings_thresholds.reduce(
        (acc, curr) => curr.threshold + acc, 
        0
    )

    res.json({ totalAmount: totalSaving - (expenses.length > 0 ? expenses[0].totalAmount : 0) })
}

module.exports = {
    getPrevExpenses,
    getPrevSaved,
}