import { MongoClient, ObjectId } from "mongodb"

// require('dotenv').config()
// DOING THIS BECAUSE NODEMON DOESN'T ALLOW ME TO USE ENV VARIABLES
import { mongo } from "../env.js"

const url = mongo
const client = new MongoClient(url)

const getData = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const email = req.params.email
    
    // IMPORTANT: This should be the name in singular
    const dataType = req.query.datatype

    const year = parseInt(req.query.year)
    const month = parseInt(req.query.month)

    let data = await db.collection(`${dataType}s`).aggregate([
        {
            $lookup: {
                from: `${dataType}_details`,
                localField: "_id",
                foreignField: `${dataType}Id`,
                as: `${dataType}Details`
            }
        },
        {
            $unwind: `$${dataType}Details`
        },
        {
            $match: {
                "userId": email,
                [`${dataType}Details.month`]: month,
                [`${dataType}Details.year`]: year
            }
        },
        {
            $project: {
                _id: 1,
                details_id: `$${dataType}Details._id`,
                name: 1,
                threshold: `$${dataType}Details.threshold`,
            }
        },
    ]).toArray()

    // Renaming the _id property
    data = data.map(cat => {
        Object.defineProperty(cat, `category_id`,
            Object.getOwnPropertyDescriptor(cat, "_id"))
        delete cat["_id"]
        return cat
    })

    res.json(data)
}

const getPrevData = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")

    const userId = req.params.userId

    // IMPORTANT: This should be the name in singular
    const dataType = req.query.datatype
    
    let year = parseInt(req.query.year)
    let month = parseInt(req.query.month) // Using the prev month 

    if(month === 0) {
        month = 12
        --year
    }

    let data = await db.collection(`${dataType}s`).aggregate([
        {
            $match: {
                userId: userId,
            },
        },
        {
            $lookup: {
                from: `${dataType}_details`,
                localField: '_id',
                foreignField: `${dataType}Id`,
                as: `${dataType}Details`
            },
        },
        {
            $unwind: `$${dataType}Details`,
        },
        {
            $match: {
                [`${dataType}Details.month`]: month,
                [`${dataType}Details.year`]: year
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                threshold: `$${dataType}Details.threshold`,
            },
        },
    ]).toArray()

    month++

    if(month === 13) {
        month = 1
        ++year
    }

    for (let i = 0; i < data.length; i++) {
        let category = data[i]

        const specificDetails = await db.collection(`${dataType}_details`).insertOne({
            [`${dataType}Id`]: new ObjectId(category._id),
            threshold: category.threshold,
            month: month,
            year: year,
        })
        if(specificDetails.insertedId) {
            category.details_id = specificDetails.insertedId
            console.log("Nice")
        } else {
            res.status(404).json("Could not insert specific category")
        }

        // Renaming the _id property
        Object.defineProperty(category, `category_id`,
            Object.getOwnPropertyDescriptor(category, "_id"))
        delete category["_id"]

    }
    
    res.json(data)
}

const addData = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    const userId = req.params.userId

    // IMPORTANT: This should be the name in singular
    const dataType = req.query.datatype

    console.log("Add data", dataType)

    const name = req.body.name
    const year = parseInt(req.body.year)
    const month = parseInt(req.body.month)

    try {
        let categoryId = ""
        
        // First verify that the user doesn't have another category with that name
        const category_exists = await db.collection(`${dataType}s`).find({
            userId: userId,
            name: name,
        }).toArray()

        // If there is no category with that name for that user, create it
        if (category_exists.length === 0) {
            const category = await db.collection(`${dataType}s`).insertOne({
                userId: userId,
                name: name,
                createdAt: new Date().toJSON()
            })

            if(category.insertedId) {
                categoryId = category.insertedId
            } else {
                res.status(404).json("ERR 1: Could not insert category")
                return
            }
        } else {
            categoryId = category_exists[0]._id.toString()
        }
        
        const specificDetails = await db.collection(`${dataType}_details`).insertOne({
            [`${dataType}Id`]: new ObjectId(categoryId),
            threshold: 0,
            month: month,
            year: year,
        })
        if(specificDetails.insertedId) {
            res.json({
                category_id: categoryId,
                details_id: specificDetails.insertedId,
            })
        } else {
            res.status(404).json("ERR 2: Could not insert specific category")
        }
    } catch(error) {
        res.status(500).json(error)
    }
}

const updateData = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    const userId = req.params.userId

    // IMPORTANT: This should be the name in singular
    const dataType = req.query.datatype

    console.log("Updating Data", dataType)

    let categoryId = req.body.category_id
    const categoryDetailsId = req.body.details_id
    const fieldToUpdate = req.body.field
    const newFieldVal = req.body.newValue

    if(fieldToUpdate === "threshold") {
        try {
            const result = await db.collection(`${dataType}_details`).updateOne(
                { _id: new ObjectId(categoryDetailsId) }, // ID of document to update
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

            let prevObjId = categoryId
        
            // First verify that the user doesn't have another category with that name
            const category_exists = await db.collection(`${dataType}s`).find({
                userId: userId,
                name: newFieldVal,
            }).toArray()

            // If there is no category with that name for that user, create it
            if (category_exists.length === 0) {

                // Inserting the new category
                const category = await db.collection(`${dataType}s`).insertOne({
                    userId: userId,
                    name: newFieldVal,
                    createdAt: new Date().toJSON()
                })

                if(category.insertedId) {
                    categoryId = category.insertedId
                } else {
                    res.status(404).json("ERR 1: Could not insert category")
                    return
                }

            } else {
                // If the category already exists, use it
                categoryId = category_exists[0]._id
            }

            // Updating the category details id to the new category
            const category_details = await db.collection(`${dataType}_details`).updateOne(
                { _id: new ObjectId(categoryDetailsId) }, // ID of document to update
                { $set: { 
                    [`${dataType}Id`]: categoryId, // changing new value
                } } 
            )
    
            if (category_details.matchedCount === 1) {
                res.json(categoryId) // Returning the new category_id for that category
            } else {
                res.status(404).json("Category details not found")
            }

            // Check if the previous category is used in any other month
            const prevCategoryUse = await db.collection(`${dataType}_details`).find({
                [`${dataType}Id`]: new ObjectId(prevObjId)
            }).toArray()
            // If it's not used, delete that category
            if(prevCategoryUse.length === 0) {
                db.collection(`${dataType}s`).deleteOne({
                    _id: new ObjectId(prevObjId)
                })
            }

        } catch(error) {
            res.status(500).json(error)
        }
    }
}

const deleteData = async (req, res) => {
    await client.connect()
    const db = client.db("ExpensesCluster")
    // const userId = req.params.userId

    // IMPORTANT: This should be the name in singular
    const dataType = req.query.datatype
    
    console.log("Deleting Data", dataType)

    const categoryId = req.body.category_id
    const detailsId = req.body.details_id

    let couldDeteleData = false

    try {
        const details_result = await db.collection(`${dataType}_details`).deleteOne({
            _id: new ObjectId(detailsId)
        })
        if (details_result.deletedCount === 1) {
            // Check if the category doesn't any details (it's not used in any month)
            const categoryects = await db.collection(`${dataType}_details`).find({
                [`${dataType}Id`]: new ObjectId(categoryId)
            }).toArray()

            // If that category is not used in any month, delete it from that collection
            if(categoryects.length === 0) {
                console.log(categoryId)
                const del_budget = await db.collection(`${dataType}s`).deleteOne({
                    _id: new ObjectId(categoryId)
                })
                if(del_budget.deletedCount !== 1) {
                    res.status(404).json("Unused category was not deleted correctly")
                    return
                } else {
                    couldDeteleData = true 
                }
            }

            res.json(`Data (of that month) deleted successfully and ${couldDeteleData ? "also" : "didn't"} deleted the whole category`)
        } else {
            res.status(404).json("Data not found")
        }
    } catch(error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getData,
    getPrevData,
    addData,
    updateData,
    deleteData,
}