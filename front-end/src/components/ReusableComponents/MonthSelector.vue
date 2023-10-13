<template>
    <div class="input-group mb-3 no-arrow">
        <button 
            class="btn btn-outline-secondary arrows-icons-btn" type="button"
            @click="arrowClick(true)"
        >
            <img src="@/assets/caret-left-fill.svg" alt="Trash can" />
        </button>
        <select 
            class="form-select" 
            @change="setSelectedMonth($event)"
        >
            <option 
                v-for="(month, index) in months"
                :key="index"
                :value="month"
                :selected="monthEdit === month"
            >{{ month }}</option>
        </select>
        <select 
            class="form-select no-arrow"
            @change="setSelectedYear($event)"
        >
            <option 
                v-for="(year, index) in props.years"
                :key="index"
                :value="year"
                :selected="yearEdit == year"
            >{{ year }}</option>
        </select>
        <button 
            class="btn btn-outline-secondary arrows-icons-btn" type="button"
            @click="arrowClick(false)"
        >
            <img src="@/assets/caret-right-fill.svg" alt="Trash can" />
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, } from "vue"

const props = defineProps({
    years: Array,
    currMonthInNum: Number,
    currYear: {
        type: [Number, String],
        required: true,
    },
})

const emit = defineEmits(["update:curr-month-in-num", "update:curr-year"])

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const monthEdit = ref(months[props.currMonthInNum])
const yearEdit = ref(props.currYear)

const arrowClick = (isLeft) => {
    const m = monthEdit.value
    const y = yearEdit.value
    if(isLeft) {
        if(m === "January" && 
        y != props.years[0]) {
            yearEdit.value = parseInt(y) - 1
            monthEdit.value = "December"
            emit("update:curr-year", yearEdit.value)
        } else if (m !== "January") {
            monthEdit.value = months[months.indexOf(m)-1]
        }
    } else {
        if(m === "December" && 
        y != props.years.slice(-1)) {
            yearEdit.value = parseInt(y) + 1
            monthEdit.value = "January"
            emit("update:curr-year", yearEdit.value)
        } else if (m !== "December") {
            monthEdit.value = months[months.indexOf(m)+1]
        }
    }
    emit("update:curr-month-in-num", months.indexOf(monthEdit.value))
}

const setSelectedMonth = (event) => {
    monthEdit.value = event.target.value
    emit("update:curr-month-in-num", months.indexOf(monthEdit.value))
}
const setSelectedYear = (event) => {
    yearEdit.value = event.target.value
    emit("update:curr-year", yearEdit.value)
}
</script>

<style>
.arrows-icons-btn {
    padding: 0.3rem;
    align-content: center;
}
.arrows-icons-btn img {
    filter: invert(100%) sepia(2%) saturate(2127%) hue-rotate(313deg) brightness(94%) contrast(76%);
    width: 1.3em;
    height: 1.3em;
    /* Looks a little down without this: */
    padding-bottom: 0.1rem;
}
.no-arrow select {
    padding-right: 0.75rem;
    background-image: none;
    cursor: pointer;
    text-align-last:center;
}
.no-arrow select option {
    text-align: center;
}
</style>