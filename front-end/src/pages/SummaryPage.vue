<template>
    <div class="select-month-or-range">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ selectByMonth ? "By month" : "By range of months" }}
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a 
                        class="dropdown-item" 
                        @click="() => selectByMonth = true"
                        style="cursor: pointer;"
                    >By month</a>
                </li>
                <li>
                    <a 
                        class="dropdown-item" 
                        @click="() => selectByMonth = false"
                        style="cursor: pointer;"
                    >By range of months</a>
                </li>
            </ul>
        </div>
    </div>

    <div v-if="selectByMonth" class="div-dates-selector">
        <div class="month-selector-center">
            <MonthSelector
                :years="props.years" 
                :curr-month-in-num="props.currMonthInNum"
                @update:curr-month-in-num="updateCurrMonth"
                :curr-year="props.currYear"
                @update:curr-year="updateCurrYear"
            />
        </div>
    </div>
    
    <div v-else class="div-dates-selector">
        <p class="date-range-title">From:</p>
        <div class="month-selector-center">
            <MonthSelector
                :years="props.years" 
                :curr-month-in-num="fromMonth"
                @update:curr-month-in-num="updateFromMonth"
                :curr-year="fromYear"
                @update:curr-year="updateFromYear"
                :disable="true"
            />
        </div>
        <p class="date-range-title">To:</p>
        <div class="month-selector-center">
            <MonthSelector
                :years="props.years" 
                :curr-month-in-num="toMonth"
                @update:curr-month-in-num="updateToMonth"
                :curr-year="toYear"
                @update:curr-year="updateToYear"
                :disable="true"
            />
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
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue"

import CardList from "@/components/Summary/CardList.vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"
import { getPrevExpensesTotal } from "@/functions/summaryAPI";

const selectByMonth = ref(true)

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
})

const emit = defineEmits([
    "update:expenses",
    "update:categories", 
    "update:curr-month-in-num", 
    "update:curr-year", 
])

const updateCurrMonth = (newMonth) => emit("update:curr-month-in-num", newMonth)
const updateCurrYear = (newYear) => emit("update:curr-year", newYear)

const fromMonth = ref(0)
const toMonth = ref(11)

const updateFromMonth = () => {}
const updateToMonth = () => {}

const fromYear = ref(2023)
const toYear = ref(2023)

const updateFromYear = () => {}
const updateToYear = () => {}

const prevExpensesTotal = ref(0)

const setPrevExpensesTotal = async () => {
    prevExpensesTotal.value = await getPrevExpensesTotal(props.currYear, props.currMonthInNum)
} 

watch(
    () => props.activateSummary,
    () => {
        setPrevExpensesTotal()
    }
)
</script>

<style>
.select-month-or-range {
    margin-bottom: 1rem;
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