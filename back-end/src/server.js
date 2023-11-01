import express from "express"

const app = express()
app.use(express.json())

// ----------------- EXPENSES ----------------- //
const expensesAPI = require("./endpoints/expenses.js")
app.get("/api/expenses/:email", expensesAPI.getExpenses)
app.post("/api/add-expense/:userId", expensesAPI.addExpense)
app.put("/api/update-expense/:userId", expensesAPI.updateExpense)
app.delete("/api/remove-expense/:userId", expensesAPI.removeExpense)

const categoriesAPI = require("./endpoints/categories.js")
// ----------------- BUDGETS ----------------- //
app.get("/api/budget/:email", categoriesAPI.getData)
app.get("/api/prev-budget/:userId", categoriesAPI.getPrevData)
app.post("/api/add-budget/:userId", categoriesAPI.addData)
app.put("/api/update-budget/:userId", categoriesAPI.updateData)
app.delete("/api/remove-budget/:userId", categoriesAPI.deleteData)

// ----------------- SAVINGS ----------------- //
app.get("/api/savings/:email", categoriesAPI.getData)
app.get("/api/prev-savings/:userId", categoriesAPI.getPrevData)
app.post("/api/add-saving/:userId", categoriesAPI.addData)
app.put("/api/update-saving/:userId", categoriesAPI.updateData)
app.delete("/api/remove-saving/:userId", categoriesAPI.deleteData)

// ----------------- GENERAL ----------------- //
const generalAPI = require("./endpoints/general.js")
app.get("/api/years/:email", generalAPI.getYears)

const port = 8000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})