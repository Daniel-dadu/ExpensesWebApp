import express from "express"
import { expenses } from "./expenses-obj"

const app = express()

app.get("/expenses", (req, res) => {
    res.json(expenses.list)
})

app.get("/categories", (req, res) => {
    res.json(expenses.categories)
})

app.listen(8000, () => {
    console.log("Server is listening on port 8000")
})