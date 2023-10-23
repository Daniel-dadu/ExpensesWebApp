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
        @update:categories="props.updateCategories"
        :changed-data="changedData"
        :curr-month-in-num="props.currMonthInNum"
    />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, } from "vue"
import axios from "axios"
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

const totalSpent = ref(0)

const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)
const updateExpenses = (option, idx, field, data) => emit("update:expenses", option, idx, field, data)

const updateTotalSpent = () => {
    console.log("Updating total spent in Expenses Page")
    const cont = 0
    totalSpent.value = props.expenses.reduce(
        (added, currExpense) => added + parseFloat(currExpense.amount), 
        cont
    )
}

watch(
    () => props.expenses,
    () => updateTotalSpent()
)

// Function called from the modal, executed when the data is changed
const changedData = async (from, idx, data) => {
    updateTotalSpent()
    // console.log("Send a PUT here")
    // console.log(props.expenses[idx])
    if(from === "addExpense") {
        console.log("addExpense")
        console.log(data)
        try {
            const response = await axios.post(`/api/add-expense/${window.localStorage.getItem("email")}`, data)
            const newId = response.data
            emit("update:expenses", "field", idx, "_id", newId)
        } catch (error) {
            console.log(error)
        }
    }
}
</script>

<style>
#expenses-page-title {
    margin-bottom: 2rem;
}
</style>