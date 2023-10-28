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
        :title="'Total left'"
        :amount="
            props.budgets.reduce((acc, curr) => acc + curr.limit, 0) - 
            amountsSpentInBudgets.reduce((acc, curr) => acc + curr, 0)
        "
    />
    <TableBudget
        :budgets="props.budgets"
        @update:budgets="updateBudgets"
        :expenses="props.expenses"
        @update:expenses="updateExpenses"
        :amounts-spent-in-budgets="amountsSpentInBudgets"
        :import-prev-budgets="props.importPrevBudgets"
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import TableBudget from "@/components/Budget/TableBudget.vue"

const props = defineProps({
    budgets: Array,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
    expenses: Array,
    importPrevBudgets: Function,
})

const emit = defineEmits(["update:budgets", "update:curr-month-in-num", "update:curr-year", "update:expenses"])

const updateBudgets = (option, newVal, idx, field) => emit("update:budgets", option, newVal, idx, field)
const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)
const updateExpenses = (option, newVal, idx, field) => emit("update:expenses", option, newVal, idx, field)

const amountsSpentInBudgets = ref([])

watch(
    () => [props.expenses, props.budgets],
    ([newExpenses, newBudgets]) => {
        amountsSpentInBudgets.value = newBudgets.map((cat) => {
            let cont = 0
            return newExpenses.reduce(
                (acc, currExp) => currExp.category == cat.name ? 
                    acc + parseFloat(currExp.amount) : acc, 
                cont
            )
        })
    },
    { deep: true },
)
</script>