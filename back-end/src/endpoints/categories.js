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
    data = data.map(obj => {
        Object.defineProperty(obj, `${dataType}_id`,
            Object.getOwnPropertyDescriptor(obj, "_id"))
        delete obj["_id"]
        return obj
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
    let month = parseInt(req.query.month)-1

    if(month === -1) {
        month = 11
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

    if(month === 12) {
        month = 0
        ++year
    }

    for (let i = 0; i < data.length; i++) {
        let obj = data[i]

        const specificDetails = await db.collection(`${dataType}_details`).insertOne({
            [`${dataType}Id`]: new ObjectId(obj._id),
            threshold: obj.threshold,
            month: month,
            year: year,
        })
        if(specificDetails.insertedId) {
            obj.details_id = specificDetails.insertedId
            console.log("Nice")
        } else {
            res.status(404).json("Could not insert specific category")
        }

        // Renaming the _id property
        Object.defineProperty(obj, `${dataType}_id`,
            Object.getOwnPropertyDescriptor(obj, "_id"))
        delete obj["_id"]

    }
    
    console.log("done")
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
    const month = req.body.month
    const year = req.body.year

    try {
        let objId = ""
        
        // First verify that the user doesn't have another obj with that name
        const obj_exists = await db.collection(`${dataType}s`).find({
            userId: userId,
            name: name,
        }).toArray()

        // If there is no obj with that name for that user, create it
        if (obj_exists.length === 0) {
            const obj = await db.collection(`${dataType}s`).insertOne({
                userId: userId,
                name: name,
                createdAt: new Date().toJSON()
            })

            if(obj.insertedId) {
                objId = obj.insertedId
            } else {
                res.status(404).json("ERR 1: Could not insert category")
                return
            }
        } else {
            objId = obj_exists[0]._id.toString()
        }
        
        const specificDetails = await db.collection(`${dataType}_details`).insertOne({
            [`${dataType}Id`]: new ObjectId(objId),
            threshold: 0,
            month: month,
            year: year,
        })
        if(specificDetails.insertedId) {
            res.json({
                [`${dataType}_id`]: objId,
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

    let objId = req.body.obj_id
    const objDetailsId = req.body.details_id
    const fieldToUpdate = req.body.field
    const newFieldVal = req.body.newValue

    if(fieldToUpdate === "threshold") {
        try {
            const result = await db.collection(`${dataType}_details`).updateOne(
                { _id: new ObjectId(objDetailsId) }, // ID of document to update
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

            let prevObjId = objId
        
            // First verify that the user doesn't have another obj with that name
            const obj_exists = await db.collection(`${dataType}s`).find({
                userId: userId,
                name: newFieldVal,
            }).toArray()

            // If there is no obj with that name for that user, create it
            if (obj_exists.length === 0) {

                // Inserting the new category
                const obj = await db.collection(`${dataType}s`).insertOne({
                    userId: userId,
                    name: newFieldVal,
                    createdAt: new Date().toJSON()
                })

                if(obj.insertedId) {
                    objId = obj.insertedId
                } else {
                    res.status(404).json("ERR 1: Could not insert category")
                    return
                }

                // Updating the category details id to the new category
                const obj_details = await db.collection(`${dataType}_details`).updateOne(
                    { _id: new ObjectId(objDetailsId) }, // ID of document to update
                    { $set: { 
                        [`${dataType}Id`]: objId, // changing new value
                    } } 
                )
        
                if (obj_details.matchedCount === 1) {
                    res.json(objId) // Returning the new obj_id for that object
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

            } else {
                // If the category already exists, update it
                objId = obj_exists[0]._id

                // Update the name of the existing category
                const updateName = await db.collection(`${dataType}s`).updateOne(
                    { _id: objId }, // ID of document to update
                    { $set: { 
                        name: newFieldVal, // changing new value
                    } } 
                )
                if (updateName.matchedCount === 1) {
                    res.json(objId) // Returning the new obj_id for that object
                } else {
                    res.status(404).json("Category (update) not found")
                    return
                }

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

    const objId = req.body.obj_id
    const detailsId = req.body.details_id

    let couldDeteleData = false

    try {
        const details_result = await db.collection(`${dataType}_details`).deleteOne({
            _id: new ObjectId(detailsId)
        })
        if (details_result.deletedCount === 1) {
            // Check if the object doesn't any details (it's not used in any month)
            const objects = await db.collection(`${dataType}_details`).find({
                [`${dataType}Id`]: new ObjectId(objId)
            }).toArray()

            // If that object is not used in any month, delete it from that collection
            if(objects.length === 0) {
                console.log(objId)
                const del_budget = await db.collection(`${dataType}s`).deleteOne({
                    _id: new ObjectId(objId)
                })
                if(del_budget.deletedCount !== 1) {
                    res.status(404).json("Unused object was not deleted correctly")
                    return
                } else {
                    couldDeteleData = true 
                }
            }

            res.json(`Data (of that month) deleted successfully and ${couldDeteleData ? "also" : "didn't"} deleted the whole object`)
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