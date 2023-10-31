import { MongoClient, ObjectId } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getSavings = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const email = req.params.email
    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    let savings = await db.collection("savings").find({}).toArray()

    res.json(savings)
}

module.exports = {
    getSavings,
}