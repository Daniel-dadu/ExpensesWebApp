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
            props.data.reduce((acc, curr) => acc + curr.limit, 0) - 
            amountsUsed.reduce((acc, curr) => acc + curr, 0)
        "
    />
    <TableCategories
        :data="props.data"
        @update:data="updateData"
        :expenses="props.expenses"
        @update:expenses="updateExpenses"
        :amounts-used="amountsUsed"
        :import-prev="props.importPrev"
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import TableCategories from "@/components/Categories/TableCategories.vue"

const props = defineProps({
    dataType: String,
    data: Array,
    importPrev: Function,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
    expenses: Array,
})

const emit = defineEmits(["update:data", "update:curr-month-in-num", "update:curr-year", "update:expenses"])

const updateData = (option, newVal, idx, field) => emit("update:data", option, newVal, idx, field)
const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)
const updateExpenses = (option, newVal, idx, field) => emit("update:expenses", option, newVal, idx, field)

const amountsUsed = ref([])

watch(
    () => [props.expenses, props.data],
    ([newExpenses, newData]) => {
        amountsUsed.value = newData.map((cat) => {
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