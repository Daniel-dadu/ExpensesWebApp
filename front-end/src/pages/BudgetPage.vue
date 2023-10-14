<template>
    <div class="month-selector-center">
        <MonthSelector 
            :years="props.years" 
            :curr-month-in-num="currMonth"
            @update:curr-month-in-num="updateCurrMonth"
            :curr-year="currYear"
            @update:curr-year="updateCurrYear"
        />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, } from "vue"
import MonthSelector from "@/components/ReusableComponents/MonthSelector.vue"

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
    updateCategories: Function,
    currMonthInNum: Number,
    currYear: Number,
    years: Array,
})

const emit = defineEmits(["update:curr-month-in-num", "update:curr-year"])

const currMonth = ref(props.currMonthInNum) // Set to actual month
const currYear = ref(props.currYear) // Set to actual year

watch(
    () => [props.currMonthInNum, props.currYear],
    ([newMonth, newYear]) => {
        currMonth.value = newMonth
        currYear.value = newYear
    }
)

const updateCurrMonth = (newMonth) => {
    currMonth.value = newMonth
    emit("update:curr-month-in-num", newMonth)
}

const updateCurrYear = (newYear) => {
    currYear.value = newYear
    emit("update:curr-year", newYear)
}
</script>