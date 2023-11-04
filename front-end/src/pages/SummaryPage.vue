<template>
    <div class="select-month-or-range">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ selectByMonth ? "By month" : "By range of months" }}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" @click="() => selectByMonth = true">By month</a></li>
                <li><a class="dropdown-item" @click="() => selectByMonth = false">By range of months</a></li>
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
    />
</template>

<script setup>
import { defineProps, defineEmits, ref, } from "vue"

import CardList from "@/components/Summary/CardList.vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"

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