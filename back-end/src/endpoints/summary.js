import { MongoClient } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getPrevExpenses = async (req, res) => {

}

module.exports = {
    getPrevExpenses,
}