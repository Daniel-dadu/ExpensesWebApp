<template>
    <div id="expenses-page">
        <p class="h3" id="expenses-page-title">Expenses page</p>
        <div class="month-selector-center">
            <MonthSelector 
                :years="years" 
                :curr-month="currMonth" 
                :curr-year="currYear"
            />
        </div>
        <ExpensesTable />
    </div>
</template>

<script setup>
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue";
import ExpensesTable from "../components/Expenses/ExpensesTable.vue"

const years = [
    2023,
    2024,
    2025,
]
const currMonth = "July"
const currYear = 2023
</script>

<style>
#expenses-page {
    padding: 2rem;
}

#expenses-page-title {
    margin-bottom: 2rem;
}
</style>