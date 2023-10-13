<template>
    <div id="expenses-page">
        <p class="h3" id="expenses-page-title">Expenses page</p>
        <div class="month-selector-center">
            <MonthSelector 
                :years="years" 
                :curr-month-in-num="currMonth"
                @update:curr-month-in-num="updateCurrMonth"
                :curr-year="currYear"
                @update:curr-year="updateCurrYear"
            />
        </div>
        <div>
            <TotalTitle />
        </div>
        <ExpensesTable 
            :curr-month="currMonth"
            :curr-year="currYear"
        />
    </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import ExpensesTable from "../components/Expenses/ExpensesTable.vue"

const years = ref([])
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

const currMonth = ref(new Date().getMonth())
const currYear = ref(new Date().getFullYear())

const updateCurrMonth = (newMonth) => {
    currMonth.value = newMonth
}

const updateCurrYear = (newYear) => {
    currYear.value = newYear
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