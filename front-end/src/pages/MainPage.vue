<template>
	<div id="main-nav-div">
		<ul class="nav nav-pills nav-fill flex-column flex-sm-row" id="pills-tab" role="tablist">
		<li class="nav-item" role="presentation">
			<button class="nav-link active" id="pills-expenses-tab" data-bs-toggle="pill" data-bs-target="#pills-expenses" type="button" role="tab" aria-controls="pills-expenses" aria-selected="true">Expenses</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-budget-tab" data-bs-toggle="pill" data-bs-target="#pills-budget" type="button" role="tab" aria-controls="pills-budget" aria-selected="false">Budgets</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-savings-tab" data-bs-toggle="pill" data-bs-target="#pills-savings" type="button" role="tab" aria-controls="pills-savings" aria-selected="false">Savings</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-budget-tab" data-bs-toggle="pill" data-bs-target="#pills-bills" type="button" role="tab" aria-controls="pills-budget" aria-selected="false">Bills</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-income-tab" data-bs-toggle="pill" data-bs-target="#pills-income" type="button" role="tab" aria-controls="pills-income" aria-selected="false">Incomes</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-summary-tab" data-bs-toggle="pill" data-bs-target="#pills-summary" type="button" role="tab" aria-controls="pills-summary" aria-selected="false" @click="goSummary">Summary</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</button>
		</li>
		
		</ul>
	</div>
    <div class="tab-content" id="pills-tabContent">
		<div class="tab-pane fade show active pages-padding" id="pills-expenses" role="tabpanel" aria-labelledby="pills-expenses-tab" tabindex="0">
			<ExpensesPage
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
				:categories="[
						...budgetsEdit, 
						{name: ''}, // Separator for DropdownSelector
						...savingsEdit, 
						{name: ''}, // Separator for DropdownSelector
						...billsEdit
				]"
				@update:categories="updateCategories"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:got-expenses-from-API="gotExpensesFromAPI"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-budget" role="tabpanel" aria-labelledby="pills-budget-tab" tabindex="0">
			<CategoriesPage 
				:categ-type="'budget'"
				:categories="budgetsEdit"
				@update:categories="updateCategories"
				:import-prev="importPrev"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-savings" role="tabpanel" aria-labelledby="pills-savings-tab" tabindex="0">
			<CategoriesPage 
				:categ-type="'saving'"
				:categories="savingsEdit"
				@update:categories="updateCategories"
				:import-prev="importPrev"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-bills" role="tabpanel" aria-labelledby="pills-bills-tab" tabindex="0">
			<CategoriesPage 
				:categ-type="'bill'"
				:categories="billsEdit"
				@update:categories="updateCategories"
				:import-prev="importPrev"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-income" role="tabpanel" aria-labelledby="pills-income-tab" tabindex="0">
			<IncomesPage 
				:incomes="incomesEdit"
				@update:incomes="updateIncomes"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-summary" role="tabpanel" aria-labelledby="pills-summary-tab" tabindex="0">
			<SummaryPage 
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:total-income="calcTotal(incomesEdit, 'amount')"
				:spent="calcTotal(expensesEdit, 'amount')"
				:goal-expenses="calcTotal(budgetsEdit, 'threshold')"
				:saved="calcSaved(expensesEdit, savingsEdit)"
				:goal-savings="calcTotal(savingsEdit, 'threshold')"
				:paid="calcPaid(expensesEdit)"
				:goal-bills="calcTotal(billsEdit, 'threshold')"
				:activate-summary="activateSummaryEdit"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
			<ProfilePage />
		</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import "@vuepic/vue-datepicker/dist/main.css"

import ExpensesPage from "@/pages/ExpensesPage.vue"
import CategoriesPage from "./CategoriesPage.vue"
import IncomesPage from "./IncomesPage.vue"
import ProfilePage from "./ProfilePage.vue"
import SummaryPage from "./SummaryPage.vue"

// Functions that manages data in the Backend
import { getYears } from "@/functions/yearsAPI"
import { getExpenses, postExpense, putExpense, deleteExpense } from "@/functions/expensesAPI"
import { getCategories, getPrevCategories, postCategory, putCategory, deleteCategory, } from "@/functions/categoryAPI"
import { getIncomes, postIncome, putIncome, deleteIncome } from "@/functions/incomesAPI"


// To verify if the user logged in
onMounted(() => {
	if(window.localStorage.length === 0) {
		const router = useRouter()
		router.push("/login")
	}
})

// Month and Year used in the Selector
const month = ref(new Date().getMonth()) // Set to actual month
const year = ref(new Date().getFullYear()) // Set to actual year


// -------- GETTING YEARS FROM API -------- //
const years = ref([])
const setYears = async () => {
	years.value = await getYears()
} 
setYears() // Get years when loading component
// --------------------------------------- //


// -------- GETTING EXPENSES FROM API -------- //
const expensesEdit = ref([])
// To indicate the Expenses Page that the expenses were loaded
const gotExpensesFromAPI = ref(false)
const setExpenses = async () => {
	expensesEdit.value = await getExpenses(year.value, month.value+1)
	// To update total expenses amount
	gotExpensesFromAPI.value = !gotExpensesFromAPI.value
	// To sort the table
	updateExpenses("sort")
} 
setExpenses() // Get expenses when loading component
// ------------------------------------------ //

// -------- GETTING BUDGETS FROM API -------- //
const budgetsEdit = ref([])
const setBudgets = async () => {
	budgetsEdit.value = await getCategories("budget", year.value, month.value+1)
}
setBudgets() // Get budgets/categories when loading component
// ------------------------------------------ //

// -------- GETTING SAVINGS FROM API -------- //
const savingsEdit = ref([])
const setSavings = async () => {
	savingsEdit.value = await getCategories("saving", year.value, month.value+1)
}
setSavings()
// ------------------------------------------ //

// -------- GETTING BILLS FROM API -------- //
const billsEdit = ref([])
const setBills = async () => {
	billsEdit.value = await getCategories("bill", year.value, month.value+1)
}
setBills()
// ------------------------------------------ //

// -------- GETTING INCOMES FROM API -------- //
const incomesEdit = ref([])
const gotIncomesFromAPI = ref(false)
const setIncomes = async () => {
	incomesEdit.value = await getIncomes(year.value, month.value+1)
	gotIncomesFromAPI.value = !gotIncomesFromAPI.value
	updateIncomes("sort")
}
setIncomes()
// ------------------------------------------ //

// UPDATING EXPENSES IN FRONT AND BACK
const updateExpenses = async (option, newVal, idx, field) => {
	if (option == "update") {
		expensesEdit.value[idx][field] = newVal
		// Update expense in backend
		await putExpense({
			id: expensesEdit.value[idx]._id,
			field: field,
			newValue: newVal,
		})
	}

	else if (option == "sort") {
		// Sort the table by the date
		console.log("sorting expenses")
		expensesEdit.value.sort((a, b) => a.date < b.date ? 1 : -1)
	} 

	else if (option == "add") {
		// Add expense in backend
		const newExpense = await postExpense(newVal)
		// To add the expense at the beginning
		expensesEdit.value.unshift(newExpense)
		updateExpenses("sort")
	}

	else if (option == "remove") {
		// Save the id before deleting it
		const object_id = expensesEdit.value[idx]._id

		expensesEdit.value.splice(idx, 1)

		// Remove the expense in backend
		await deleteExpense(object_id)
	} 
}

// UPDATING CATEGORIES IN FRONT AND BACK
const updateCategories = async (categType, option, newVal, idx, field) => {
	// The categType should be in singular [budget|saving|bill] 

	if(option === "add") {
		const newCategory = await postCategory(categType, newVal, year.value, month.value+1)
		if (categType === "budget") { budgetsEdit.value.push(newCategory) } 
		else if (categType === "saving") { savingsEdit.value.push(newCategory) } 
		else if (categType === "bill") { billsEdit.value.push(newCategory) }
	} 

	else if(option === "update") {
		const allCategories = [
			...budgetsEdit.value,
			...savingsEdit.value,
			...billsEdit.value,
		]
		// Verify that the user doesn't try to use a name already in the table
		if (field === "name") {
			for(const budget of allCategories) {
				if (budget.name === newVal) { return }
			}
		}

		if (categType === "budget") {
			budgetsEdit.value[idx][field] = newVal
			const newId = await putCategory(categType, budgetsEdit.value[idx], field, newVal)
			if (newId) { budgetsEdit.value[idx]["category_id"] = newId }
		} else if (categType === "saving") {
			savingsEdit.value[idx][field] = newVal
			const newId = await putCategory(categType, savingsEdit.value[idx], field, newVal)
			if (newId) { savingsEdit.value[idx]["category_id"] = newId }
		} else if (categType === "bill") {
			billsEdit.value[idx][field] = newVal
			const newId = await putCategory(categType, billsEdit.value[idx], field, newVal)
			if (newId) { billsEdit.value[idx]["category_id"] = newId }
		}
	}
	
	else if(option === "remove") {
		let currCateg

		if (categType === "budget") { currCateg = budgetsEdit.value } 
		else if (categType === "saving") { currCateg = savingsEdit.value } 
		else if (categType === "bill") { currCateg = billsEdit.value }

		let ids = {
			category_id: currCateg[idx].category_id,
			details_id: currCateg[idx].details_id,
		}
		await deleteCategory(categType, ids)

		if (categType === "budget") { budgetsEdit.value.splice(idx, 1) } 
		else if (categType === "saving") { savingsEdit.value.splice(idx, 1) } 
		else if (categType === "bill") { billsEdit.value.splice(idx, 1) }
	} 
}

// UPDATING INCOMES IN FRONT AND BACK
const updateIncomes = async (option, newVal, idx, field) => {
	if (option == "update") {
		incomesEdit.value[idx][field] = newVal
		// Update income in backend
		await putIncome({
			id: incomesEdit.value[idx]._id,
			field: field,
			newValue: newVal,
		})
	}

	else if (option == "sort") {
		// Sort the table by the date
		console.log("sorting incomes")
		incomesEdit.value.sort((a, b) => a.date > b.date ? 1 : -1)
	} 

	else if (option == "add") {
		// Add income in backend
		const newIncome = await postIncome(newVal)
		// To add the income at the beginning
		incomesEdit.value.unshift(newIncome)
		updateIncomes("sort")
	}

	else if (option == "remove") {
		// Save the id before deleting it
		const object_id = incomesEdit.value[idx]._id

		incomesEdit.value.splice(idx, 1)

		// Remove the income in backend
		await deleteIncome(object_id)
	} 
}

const updateMonth = (newMonth) => {
	month.value = newMonth
	setBudgets()
	setSavings()
	setBills()
	setExpenses()
	setIncomes()
}

const updateYear = (newYear) => { 
	year.value = newYear
	setBudgets()
	setSavings()
	setBills()
	setExpenses()
	setIncomes()
}

const importPrev = async (categType) => {
	if (categType === "budget") {
		budgetsEdit.value = await getPrevCategories(categType, year.value, month.value+1)
	} else if (categType === "saving") {
		savingsEdit.value = await getPrevCategories(categType, year.value, month.value+1)
	} else if (categType === "bill") {
		billsEdit.value = await getPrevCategories(categType, year.value, month.value+1)
	}
}

const calcTotal = (objects, field) => 
	objects.reduce((acc, curr) => curr[field] + acc, 0)

const calcPaid = (expenses) => {
	let billsNames = new Set()
	for (let bill of billsEdit.value) {
		billsNames.add(bill.name)
	}
	return expenses.reduce((acc, curr) => 
		(billsNames.has(curr.category) ? curr.amount : 0) + acc,
		0
	)
}

const calcSaved = (expenses, savings) => {
	let countTotalSaving = 0
	let savingNames = new Set()
	for (let saving of savings) {
		countTotalSaving += saving.threshold
		savingNames.add(saving.name)
	}

	return countTotalSaving - expenses.reduce((acc, curr) => 
		(savingNames.has(curr.category) ? curr.amount : 0) + acc,
		0
	)
}

const activateSummaryEdit = ref(false)
// When summary tab is selected
const goSummary = () => {
	activateSummaryEdit.value = !activateSummaryEdit.value
}
</script>

<style>
#main-nav-div {
	padding: 2em;
}

.pages-padding {
    padding: 2rem;
}

.month-selector-center {
	margin: auto;
	width: 20rem;
}

.my-table tr td:last-child {
    width: 1%;
    white-space: nowrap;
}

.table-delete-btn {
    margin-left: 1em;
    border: 0;
}
.table-delete-btn img {
    /* To turn the svg to a lighter color */
    filter:invert(82%) sepia(3%) saturate(473%) hue-rotate(179deg) brightness(93%) contrast(88%);
}

.add-table-elem-div {
    display: flex; 
    justify-content: flex-end;
}

.div-amount-text {
	display: flex;
    align-items: center;
}
.div-amount-text button, .div-amount-text input {
	padding-left: 0.2rem;
	padding-right: 0.2rem;
}
</style>
