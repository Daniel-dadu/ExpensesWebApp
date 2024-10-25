<template>
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
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import TableIncomes from "@/components/Incomes/TableIncomes.vue"

const props = defineProps({
    incomes: Array,
    currMonthInNum: Number,
    currYear: Number,
})

const emit = defineEmits(["update:incomes"])

const totalIncome = ref(0)

const updateIncomes = (option, newVal, idx, field) => {
    emit("update:incomes", option, newVal, idx, field)
    if(field === "amount") {
        updateTotalIncome()
    }
}

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