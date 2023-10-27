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
			<!-- <ExpensesTable2 /> -->
			<ExpensesPage
				:categories="budgetsEdit"
				:update-categories="updateCategories"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
				@update:expenses="updateExpenses"
				:got-expenses-from-API="gotExpensesFromAPI"
				:update-expenses-in-backend="updateExpensesInBackend"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-budget" role="tabpanel" aria-labelledby="pills-budget-tab" tabindex="0">
			<BudgetPage 
				:categories="budgetsEdit"
				:update-categories="updateCategories"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expensesEdit"
			/>
		</div>
		<div class="tab-pane fade" id="pills-savings" role="tabpanel" aria-labelledby="pills-savings-tab" tabindex="0">
			SAVINGS COMPONENT
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
import axios from "axios"
import ExpensesPage from "@/pages/ExpensesPage.vue"
import BudgetPage from "./BudgetPage.vue"
import ProfilePage from "./ProfilePage.vue"
import "@vuepic/vue-datepicker/dist/main.css"
import { getExpenses } from "@/functions/expensesAPI"
import { getYears } from "@/functions/yearsAPI"
import { getBudgets } from "@/functions/budgetAPI"


// To verify if the user logged in
onMounted(() => {
	if(window.localStorage.length === 0) {
		const router = useRouter()
		router.push("/login")
	}
})

const month = ref(new Date().getMonth()) // Set to actual month
const year = ref(new Date().getFullYear()) // Set to actual year

const budgetsEdit = ref([])
const setBudgets = async () => {
	budgetsEdit.value = await getBudgets(year.value, month.value)
}
setBudgets() // Get budgets/categories when loading component

const years = ref([])
const setYears = async () => {
	years.value = await getYears()
} 
setYears() // Get years when loading component

const expensesEdit = ref([])
// To indicate the Expenses Page that the expenses were loaded
const gotExpensesFromAPI = ref(false)
const setExpenses = async () => {
	const response = await getExpenses(year.value, month.value)

	expensesEdit.value = response
	// To update total expenses amount
	gotExpensesFromAPI.value = !gotExpensesFromAPI.value
	// To sort the table
	updateExpenses("sort")
} 
setExpenses() // Get expenses when loading component

// Function called from the modal, executed when the data is changed
const updateExpensesInBackend = async (from, data) => {
    if(from === 1) { // 1 - Add expense
        try {
            const response = await axios.post(`/api/add-expense/${window.localStorage.getItem("email")}`, data)
            const newId = response.data

            data._id = newId
            // Add the expense with the new id from db and sort it
            updateExpenses("add", data)
            updateExpenses("sort")
        } catch (error) {
            console.log(error)
        }
    } else if (from === 2) { // 2 - Delete expense
        try {
            // The data is the _id of the object that will be deleted
            await axios.delete(`/api/remove-expense/${window.localStorage.getItem("email")}`, { data: { id: data } } )
        } catch (error) {
            console.log(error)
        }
    } else if (from === 3) { // 3 - Change field
        try {
            // The data parameter looks like this:
            // data: {
            //     id: expense id, 
            //     field: name of field, 
            //     newValue: new value of field
            // }
            await axios.put(`/api/update-expense/${window.localStorage.getItem("email")}`, data )
        } catch (error) {
            console.log(error)
        }
    }
}


const updateExpenses = (option, newVal, idx, field) => {
	if (option == "remove") {
		// To remove the expense:
		expensesEdit.value.splice(idx, 1)
	} else if (option == "sort") {
		// Sort the table by the date
		console.log("sorting")
		expensesEdit.value.sort((a, b) => a.date < b.date ? 1 : -1)
	} else if(option == "field") {
		expensesEdit.value[idx][field] = newVal
	} else if(option == "add") {
		// To add the expense at the beginning
		expensesEdit.value.unshift(newVal)
	} else {
		expensesEdit.value = newVal
	}
}

const updateCategories = async (option, newVal, idx, field) => {
	if(option === "add") {
		try {
			// Adding the curr month and year to the category obj
			let newCategory = {
				month: month.value,
				year: year.value,
				...newVal
			}

            const response = await axios.post(
				`/api/add-budget/${window.localStorage.getItem("email")}`, 
				newCategory
			)

			// Got the ids from the API after inserting the budget
            const newIds = response.data

			// Setting the ids to the newCat
            newCategory.budget_id =  newIds.budget_id
			newCategory.details_id = newIds.details_id

			budgetsEdit.value.push(newCategory)
        } catch (error) {
            console.log(error)
        }
	} else if(option === "remove") {
		try {
			// Setting the ids of the budget to delete
			let ids = {
				budget_id: budgetsEdit.value[idx].budget_id,
				details_id: budgetsEdit.value[idx].details_id,
			}

            await axios.delete(
				`/api/remove-budget/${window.localStorage.getItem("email")}`, 
				{ data: ids }
			)

			budgetsEdit.value.splice(idx, 1)
        } catch (error) {
            console.log(error)
        }
	} else if(option === "update") {
		budgetsEdit.value[idx][field] = newVal
	}
}


const updateMonth = (newMonth) => {
	month.value = newMonth
	setBudgets()
	setExpenses()
}

const updateYear = (newYear) => { 
	year.value = newYear
	setBudgets()
	setExpenses()
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
