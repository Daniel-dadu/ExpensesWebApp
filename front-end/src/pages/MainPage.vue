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
				:categories="categoriesEdit"
				:update-categories="updateCategories"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expenses"
				@update:expenses="updateExpenses"
				:got-expenses-from-API="gotExpensesFromAPI"
			/>
		</div>
		<div class="tab-pane fade pages-padding" id="pills-budget" role="tabpanel" aria-labelledby="pills-budget-tab" tabindex="0">
			<BudgetPage 
				:categories="categoriesEdit"
				:update-categories="updateCategories"
				:curr-month-in-num="month"
				@update:curr-month-in-num="updateMonth"
				:curr-year="year"
				@update:curr-year="updateYear"
				:years="years"
				:expenses="expenses"
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

// To verify if the user logged in
onMounted(() => {
	if(window.localStorage.length === 0) {
		const router = useRouter()
		router.push("/login")
	}
})

const month = ref(new Date().getMonth()) // Set to actual month
const year = ref(new Date().getFullYear()) // Set to actual year

const categoriesEdit = ref([])
const getAPICategories = async () => {
    try {
        const response = await axios.get(`/api/budget/${window.localStorage.getItem("email")}/?year=${year.value}&month=${month.value}`)
        categoriesEdit.value = response.data
    } catch (error) {
        console.log(error)
    }
}
getAPICategories() // Get categories when loading component

const years = ref([])
const getAPIYears = async () => {
    try {
        const response = await axios.get(`/api/years/${window.localStorage.getItem("email")}`)
		// Turning all the date strings into Date
        years.value = response.data
    } catch (error) {
        console.log(error)
    }
} 
getAPIYears() // Get years when loading component

const expenses = ref([])
// To indicate the Expenses Page that the expenses were loaded
const gotExpensesFromAPI = ref(false)
const getAPIExpenses = async () => {
    try {
        const response = await axios.get(`/api/expenses/${window.localStorage.getItem("email")}/?year=${year.value}&month=${month.value}`)
		// Turning all the date strings into Date
        expenses.value = response.data.map((expense) => { 
			return {...expense, "date": new Date(expense.date)} 
		})
		// To update total expenses amount
		gotExpensesFromAPI.value = !gotExpensesFromAPI.value
		// To sort the table
		updateExpenses("sort")
    } catch (error) {
        console.log(error)
    }
} 
getAPIExpenses() // Get expenses when loading component

const updateExpenses = (option, idx, field, newVal) => {
	if (option == "remove") {
		// To remove the expense:
		expenses.value.splice(idx, 1)
	} else if (option == "sort") {
		// Sort the table by the date
		console.log("sorting")
		expenses.value.sort((a, b) => a.date < b.date ? 1 : -1)
	} else if(option == "field") {
		expenses.value[idx][field] = newVal
	} else if(option == "add") {
		// To add the expense at the beginning
		expenses.value.unshift(newVal)
	} else {
		expenses.value = newVal
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

			categoriesEdit.value.push(newCategory)
        } catch (error) {
            console.log(error)
        }
	} else if(option === "remove") {
		try {
			// Setting the ids of the budget to delete
			let ids = {
				budget_id: categoriesEdit.value[idx].budget_id,
				details_id: categoriesEdit.value[idx].details_id,
			}

            await axios.delete(
				`/api/remove-budget/${window.localStorage.getItem("email")}`, 
				{ data: ids }
			)

			categoriesEdit.value.splice(idx, 1)
        } catch (error) {
            console.log(error)
        }
	} else if(option === "update") {
		categoriesEdit.value[idx][field] = newVal
	}
}


const updateMonth = (newMonth) => {
	month.value = newMonth
	getAPICategories()
	getAPIExpenses()
}

const updateYear = (newYear) => { 
	year.value = newYear
	getAPICategories()
	getAPIExpenses()
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
