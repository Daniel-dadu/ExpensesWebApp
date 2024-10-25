<template>
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
import TotalTitle from "@/components/ReusableComponents/TotalTitle.vue"
import TableCategories from "@/components/Categories/TableCategories.vue"

const props = defineProps({
    categType: String,
    categories: Array,
    importPrev: Function,
    expenses: Array,
})

const emit = defineEmits(["update:categories", "update:expenses"])

const updateCategories = (option, newVal, idx, field) => emit("update:categories", props.categType, option, newVal, idx, field)
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