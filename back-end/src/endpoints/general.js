import { MongoClient } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getYears = async (req, res) => {
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
}

module.exports = {
    getYears,
}