<template>
	<div id="main-nav-div">
		<ul class="nav nav-pills nav-fill flex-column flex-sm-row" id="pills-tab" role="tablist">
		<li class="nav-item" role="presentation">
			<button class="nav-link active" id="pills-expenses-tab" data-bs-toggle="pill" data-bs-target="#pills-expenses" type="button" role="tab" aria-controls="pills-expenses" aria-selected="true">Expenses</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-budget-tab" data-bs-toggle="pill" data-bs-target="#pills-budget" type="button" role="tab" aria-controls="pills-budget" aria-selected="false">Budget</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-savings-tab" data-bs-toggle="pill" data-bs-target="#pills-savings" type="button" role="tab" aria-controls="pills-savings" aria-selected="false">Savings</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-budget-tab" data-bs-toggle="pill" data-bs-target="#pills-payments" type="button" role="tab" aria-controls="pills-budget" aria-selected="false">Payments</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-summary-tab" data-bs-toggle="pill" data-bs-target="#pills-summary" type="button" role="tab" aria-controls="pills-summary" aria-selected="false">Summary</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</button>
		</li>
		
		</ul>
	</div>
    <div class="tab-content" id="pills-tabContent">
		<div class="tab-pane fade show active pages-padding" id="pills-expenses" role="tabpanel" aria-labelledby="pills-expenses-tab" tabindex="0">
			<ExpensesPage
				:categories="budgetsEdit"
				@update:categories="updateBudgets"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
				:got-expenses-from-API="gotExpensesFromAPI"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-budget" role="tabpanel" aria-labelledby="pills-budget-tab" tabindex="0">
			<CategoriesPage 
				:data-type="'budgets'"
				:data="budgetsEdit"
				@update:data="updateBudgets"
				:import-prev="importPrevBudgets"
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
				:data-type="'savings'"
				:data="savingsEdit"
				@update:data="updateSavings"
				:import-prev="importPrevSavings"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
			/>
		</div>
		<div class="tab-pane fade" id="pills-payments" role="tabpanel" aria-labelledby="pills-budget-tab" tabindex="0">
			PAYMENTS COMPONENT
		</div>
		<div class="tab-pane fade" id="pills-summary" role="tabpanel" aria-labelledby="pills-summary-tab" tabindex="0">
			SUMMARY COMPONENT
		</div>
		<div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
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
import ProfilePage from "./ProfilePage.vue"

// Functions that manages data in the Backend
import { getYears } from "@/functions/yearsAPI"
import { getExpenses, postExpense, putExpense, deleteExpense } from "@/functions/expensesAPI"
import { getCategories, getPrevCategories, postCategory, putCategory, deleteCategory, } from "@/functions/categoryAPI"
import { getSavings, getPrevSavings, postSaving, putSaving, deleteSaving, } from "@/functions/savingsAPI"


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


// -------- GETTING BUDGETS FROM API -------- //
const budgetsEdit = ref([])
const setBudgets = async () => {
	budgetsEdit.value = await getCategories(year.value, month.value)
}
setBudgets() // Get budgets/categories when loading component
// ------------------------------------------ //


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
	expensesEdit.value = await getExpenses(year.value, month.value)
	// To update total expenses amount
	gotExpensesFromAPI.value = !gotExpensesFromAPI.value
	// To sort the table
	updateExpenses("sort")
} 
setExpenses() // Get expenses when loading component
// ------------------------------------------ //


// -------- GETTING SAVINGS FROM API -------- //
const savingsEdit = ref([])
const setSavings = async () => {
	savingsEdit.value = await getSavings(year.value, month.value)
}
setSavings()
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
		console.log("sorting")
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

// UPDATING BUDGETS IN FRONT AND BACK
const updateBudgets = async (option, newVal, idx, field) => {
	if(option === "add") {
		const newBudget = await postCategory(newVal, year.value, month.value)
		budgetsEdit.value.push(newBudget)
	} 

	else if(option === "update") {
		// Verify that the user doesn't try to use a name already in the table
		if (field === "name") {
			for(const budget of budgetsEdit.value) {
				if (budget.name === newVal) { return }
			}
		}

		budgetsEdit.value[idx][field] = newVal
		const newBudgetId = await putCategory(budgetsEdit.value[idx], field, newVal)
		if (newBudgetId) {
			budgetsEdit.value[idx]["category_id"] = newBudgetId
		}
	}
	
	else if(option === "remove") {
		let ids = {
			category_id: budgetsEdit.value[idx].category_id,
			details_id: budgetsEdit.value[idx].details_id,
		}
		console.log(ids)
		await deleteCategory(ids)

		budgetsEdit.value.splice(idx, 1)
	} 
}

// UPDATING SAVINGS IN FRONT AND BACK
const updateSavings = async (option, newVal, idx, field) => {
	if(option === "add") {
		const newSaving = await postSaving(newVal, year.value, month.value)
		savingsEdit.value.push(newSaving)
	} 

	else if(option === "update") {
		// Verify that the user doesn't try to use a name already in the table
		if (field === "name") {
			for(const saving of savingsEdit.value) {
				if (saving.name === newVal) { return }
			}
		}

		savingsEdit.value[idx][field] = newVal
		const newSavingId = await putSaving(savingsEdit.value[idx], field, newVal)
		if (newSavingId) {
			savingsEdit.value[idx]["category_id"] = newSavingId
		}
	}
	
	else if(option === "remove") {
		let ids = {
			category_id: savingsEdit.value[idx].category_id,
			details_id: savingsEdit.value[idx].details_id,
		}
		console.log(ids)
		await deleteSaving(ids)

		savingsEdit.value.splice(idx, 1)
	} 
}

const updateMonth = (newMonth) => {
	month.value = newMonth
	setBudgets()
	setExpenses()
	setSavings()
}

const updateYear = (newYear) => { 
	year.value = newYear
	setBudgets()
	setExpenses()
	setSavings()
}

const importPrevBudgets = async () => {
	budgetsEdit.value = await getPrevCategories(year.value, month.value)
	console.log(budgetsEdit.value)
}

const importPrevSavings = async () => {
	savingsEdit.value = await getPrevSavings(year.value, month.value)
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
</style>
