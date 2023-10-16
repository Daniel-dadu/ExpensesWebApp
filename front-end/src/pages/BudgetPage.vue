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
            props.categories.reduce((acc, curr) => acc + curr.limit, 0) - 
            amountsSpentInBudgets.reduce((acc, curr) => acc + curr, 0)
        "
    />
    <TableBudget
        :categories="props.categories"
        @update:categories="props.updateCategories"
        :expenses="props.expenses"
        :amounts-spent-in-budgets="amountsSpentInBudgets"
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import TableBudget from "@/components/Budget/TableBudget.vue"

const props = defineProps({
    categories: Array,
    updateCategories: Function,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
    expenses: Array,
})

const emit = defineEmits(["update:curr-month-in-num", "update:curr-year"])

const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)

const amountsSpentInBudgets = ref([])

watch(
    () => [props.expenses, props.categories],
    ([newExpenses, newCategories]) => {
        amountsSpentInBudgets.value = newCategories.map((cat) => {
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