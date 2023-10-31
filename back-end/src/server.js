import express from "express"

const app = express()
app.use(express.json())

// ----------------- EXPENSES ----------------- //
const expensesAPI = require("./endpoints/expenses.js")
app.get("/api/expenses/:email", expensesAPI.getExpenses)
app.post("/api/add-expense/:userId", expensesAPI.addExpense)
app.put("/api/update-expense/:userId", expensesAPI.updateExpense)
app.delete("/api/remove-expense/:userId", expensesAPI.removeExpense)

// ----------------- BUDGETS ----------------- //
const budgetsAPI = require("./endpoints/budgets.js")
app.get("/api/budget/:email", budgetsAPI.getBudgets)
app.get("/api/prev-budget/:userId", budgetsAPI.getPrevBudgets)
app.post("/api/add-budget/:userId", budgetsAPI.addBudget)
app.put("/api/update-budget/:userId", budgetsAPI.updateBudget)
app.delete("/api/remove-budget/:userId", budgetsAPI.deleteBudget)

// ----------------- GENERAL ----------------- //
const generalAPI = require("./endpoints/general.js")
app.get("/api/years/:email", generalAPI.getYears)

const port = 8000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})