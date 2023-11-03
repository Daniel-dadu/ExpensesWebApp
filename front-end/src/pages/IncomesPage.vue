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
        :title="'Total income'"
        :amount="totalIncome"
    />
    <TableIncomes
        :incomes="props.incomes"
        @update:incomes="updateIncomes"
        :curr-month-in-num="props.currMonthInNum"
        :curr-year="props.currYear"
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import TableIncomes from "@/components/Incomes/TableIncomes.vue"

const props = defineProps({
    incomes: Array,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
})

const emit = defineEmits(["update:incomes", "update:curr-month-in-num", "update:curr-year", ])

const totalIncome = ref(0)

const updateIncomes = (option, newVal, idx, field) => {
    emit("update:incomes", option, newVal, idx, field)
    if(field === "amount") {
        updateTotalIncome()
    }
} 
const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)

const updateTotalIncome = () => {
    console.log("Updating total spent in Incomes Page")
    const cont = 0
    totalIncome.value = props.incomes.reduce(
        (added, currIncome) => added + parseFloat(currIncome.amount), 
        cont
    )
}

// To update totalIncome when an income is deleted 
watch(
    () => props.incomes.length,
    () => updateTotalIncome()
)
</script>