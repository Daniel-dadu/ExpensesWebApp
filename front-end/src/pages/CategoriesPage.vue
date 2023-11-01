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
        :title="title"
        :amount="
            props.categType === 'bill' ? 
            amountsUsed.reduce((acc, curr) => acc + curr, 0) :
            props.categories.reduce((acc, curr) => acc + curr.threshold, 0) - 
            amountsUsed.reduce((acc, curr) => acc + curr, 0)
        "
    />
    <TableCategories
        :categ-type="props.categType"
        :categories="props.categories"
        @update:categories="updateCategories"
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
    categType: String,
    categories: Array,
    importPrev: Function,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
    expenses: Array,
})

const emit = defineEmits(["update:categories", "update:curr-month-in-num", "update:curr-year", "update:expenses"])

const updateCategories = (option, newVal, idx, field) => emit("update:categories", props.categType, option, newVal, idx, field)
const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)
const updateExpenses = (option, newVal, idx, field) => emit("update:expenses", option, newVal, idx, field)

const title = props.categType === "budget" ? "Total left" 
            : props.categType === "saving" ? "Total saved"
            : props.categType === "bill" ? "Total paid" :
            "Error"

const amountsUsed = ref([])

watch(
    () => [props.expenses, props.categories],
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