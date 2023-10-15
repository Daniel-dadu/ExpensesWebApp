<template>
    <div class="month-selector-center">
        <MonthSelector 
            :years="props.years" 
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
        :expenses="props.expenses"
        @update:expenses="updateExpenses"
        :categories="props.categories"
        @update:categories="props.updateCategories"
        :changed-data="changedData"
        :curr-month-in-num="currMonth"
    />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import ExpensesTable from "../components/Expenses/ExpensesTable.vue"

const props = defineProps({
    categories: Array,
    updateCategories: Function,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
    expenses: Array,
})

const emit = defineEmits(["update:curr-month-in-num", "update:curr-year", "update:expenses"])

const currMonth = ref(props.currMonthInNum) // Set to actual month
const currYear = ref(props.currYear) // Set to actual year
const totalSpent = ref(0)

watch(
    () => [props.currMonthInNum, props.currYear],
    ([newMonth, newYear]) => {
        currMonth.value = newMonth
        currYear.value = newYear
    }
)

const updateCurrMonth = (newMonth) => {
    currMonth.value = newMonth
    emit("update:curr-month-in-num", newMonth)
}

const updateCurrYear = (newYear) => {
    currYear.value = newYear
    emit("update:curr-year", newYear)
}

const updateExpenses = (newExpenses) => {
    emit("update:expenses", newExpenses)
}

const updateTotalSpent = () => {
    const cont = 0
    totalSpent.value = props.expenses.reduce(
        (added, currExpense) => added + parseFloat(currExpense.amount), 
        cont
    )
}

watch(
    props.expenses,
    () => updateTotalSpent()
)

// Function called from the modal, executed when the data is changed
const changedData = (idx) => {
    updateTotalSpent()
    console.log("Send a PUT here")
    console.log(props.expenses[idx])
}
</script>

<style>
#expenses-page-title {
    margin-bottom: 2rem;
}
</style>