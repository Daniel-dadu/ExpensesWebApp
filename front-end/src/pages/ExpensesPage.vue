<template>
    <div class="month-selector-center">
        <MonthSelector 
            :years="props.years" 
            :curr-month-in-num="props.currMonthInNum"
            @update:curr-month-in-num="updateCurrMonth"
            :curr-year="props.currYear"
            @update:curr-year="updateCurrYear"
        />
    </div>
    <TotalTitle 
        :title="'Total spent'"
        :amount="totalSpent"
    />
    <ExpensesTable
        :expenses="props.expenses"
        @update:expenses="updateExpenses"
        :categories="props.categories"
        @update:categories="updateCategories"
        :curr-month-in-num="props.currMonthInNum"
        :curr-year="props.currYear"
    />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import ExpensesTable from "../components/Expenses/ExpensesTable.vue"

const props = defineProps({
    expenses: Array,
    categories: Array,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
    gotExpensesFromAPI: Boolean,
})

const emit = defineEmits([
    "update:expenses",
    "update:categories", 
    "update:curr-month-in-num", 
    "update:curr-year", 
])

const totalSpent = ref(0)

const updateExpenses = (option, newVal, idx, field) => {
    emit("update:expenses", option, newVal, idx, field)
    if(field === "amount") {
        updateTotalSpent()
    }
}
const updateCategories = (categType, option, newVal, idx, field) => emit("update:categories", categType, option, newVal, idx, field)
const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)

const updateTotalSpent = () => {
    console.log("Updating total spent in Expenses Page")
    const cont = 0
    totalSpent.value = props.expenses.reduce(
        (added, currExpense) => added + parseFloat(currExpense.amount), 
        cont
    )
}

watch(
    () => props.gotExpensesFromAPI,
    () => updateTotalSpent()
)

// To update totalSpent when a expense is deleted 
watch(
    () => props.expenses.length,
    () => updateTotalSpent()
)
</script>

<style>
#expenses-page-title {
    margin-bottom: 2rem;
}
</style>