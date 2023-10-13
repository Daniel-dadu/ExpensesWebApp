<template>
    <div id="expenses-page">
        <div class="month-selector-center">
            <MonthSelector 
                :years="years" 
                :curr-month-in-num="currMonth"
                @update:curr-month-in-num="updateCurrMonth"
                :curr-year="currYear"
                @update:curr-year="updateCurrYear"
            />
        </div>
        <TotalTitle 
            :title="'Total spent'"
            :amount="totalSpent"
        />
        <ExpensesTable
            :expenses="expensesEdit"
            @update:expenses="updateExpenses"
            :categories="props.categories"
            @update:categories="props.updateCategories"
            :changed-data="changedData"
            :curr-month-in-num="currMonth"
        />
    </div>
</template>

<script setup>
import { ref, defineProps, watch, } from "vue"
import axios from "axios"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import ExpensesTable from "../components/Expenses/ExpensesTable.vue"

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
    updateCategories: Function,
})

const currMonth = ref(new Date().getMonth()) // Set to actual month
const currYear = ref(new Date().getFullYear()) // Set to actual year
const years = ref([])
const expensesEdit = ref([])
const totalSpent = ref(0)

const getAPIYears = async () => {
    try {
        const response = await axios.get("/api/years")
		// Turning all the date strings into Date
        years.value = response.data
    } catch (error) {
        console.log(error)
    }
} 
getAPIYears() // Get expenses when loading component

const getAPIExpenses = async () => {
    try {
        const response = await axios.get(`/api/expenses/?year=${currYear.value}&month=${currMonth.value}`)
		// Turning all the date strings into Date
        expensesEdit.value = response.data.map((expense) => { 
			return {...expense, "date": new Date(expense.date)} 
		})
    } catch (error) {
        console.log(error)
    }
} 
getAPIExpenses() // Get expenses when loading component

const updateCurrMonth = (newMonth) => {
    currMonth.value = newMonth
    getAPIExpenses() // Update expenses
}

const updateCurrYear = (newYear) => {
    currYear.value = newYear
    getAPIExpenses() // Update expenses
}

const updateExpenses = (newExpenses) => {
    expensesEdit.value = newExpenses
}

const updateTotalSpent = () => {
    const cont = 0
    totalSpent.value = expensesEdit.value.reduce(
        (added, currExpense) => added + parseFloat(currExpense.amount), 
        cont
    )
}

// To update totalSpent.value when the page loads
watch(
    () => expensesEdit.value,
    () => updateTotalSpent() 
)

// Function called from the modal, executed when the data is changed
const changedData = (idx) => {
    updateTotalSpent()
    console.log("Send a PUT here")
    console.log(expensesEdit.value[idx])
}
</script>

<style>
#expenses-page {
    padding: 2rem;
}

#expenses-page-title {
    margin-bottom: 2rem;
}
</style>