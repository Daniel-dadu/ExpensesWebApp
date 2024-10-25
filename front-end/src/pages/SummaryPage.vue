<template>
    <div class="select-month-or-range">
        <div class="dropdown">
            <button 
                class="btn btn-secondary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
            >
                {{ selectByMonth ? "By month" : "By range of months" }}
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a 
                        class="dropdown-item" 
                        @click="() => emits('update:select-by-month', true)"
                        style="cursor: pointer;"
                    >By month</a>
                </li>
                <li>
                    <a 
                        class="dropdown-item" 
                        @click="() => emits('update:select-by-month', false)"
                        style="cursor: pointer;"
                    >By range of months</a>
                </li>
            </ul>
        </div>
    </div>

    <CardList 
        :curr-month-in-num="props.currMonthInNum"
        :curr-year="props.currYear"
        :total-income="props.totalIncome"
        :spent="props.spent"
        :goal-expenses="props.goalExpenses"
        :saved="props.saved"
        :goal-savings="props.goalSavings"
        :paid="props.paid"
        :goal-bills="props.goalBills"

        :prev-expenses-total="prevExpensesTotal"
        :prev-saved-total="prevSavedTotal"
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue"

import CardList from "@/components/Summary/CardList.vue"
import { getPrevExpensesTotal, getPrevSavedTotal, } from "@/functions/summaryAPI";

const emits = defineEmits(["update:select-by-month"])

const props = defineProps({
    years: Array,
    currMonthInNum: Number,
    currYear: Number,
    
    totalIncome: Number,
    spent: Number,
    goalExpenses: Number,
    saved: Number,
    goalSavings: Number,
    paid: Number,
    goalBills: Number,

    activateSummary: Boolean,
    selectByMonth: Boolean,
})

const prevExpensesTotal = ref(0)
const prevSavedTotal = ref(0)

const setPrevExpensesTotal = async () => {
    prevExpensesTotal.value = await getPrevExpensesTotal(props.currYear, props.currMonthInNum+1)
} 

const setPrevSavedTotal = async () => {
    prevSavedTotal.value = await getPrevSavedTotal(props.currYear, props.currMonthInNum+1)
}

watch(
    () => props.activateSummary,
    () => {
        setPrevExpensesTotal()
        setPrevSavedTotal()
    }
)
</script>

<style>
.select-month-or-range {
    margin-top: -2rem;
    margin-bottom: 3rem;
    text-align: center;
}
.date-range-title {
    text-align: center;
    margin-bottom: 0.3rem;
}
.div-dates-selector {
    margin-bottom: 2rem;
}
</style>