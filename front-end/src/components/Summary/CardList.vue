<template>
    <div class="row row-cols-auto justify-content-md-center">
        <div class="col">
            <div class="card border-light mb-3 card-size">
                <div class="card-header card-header-text">Total Income</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.totalIncome }}</h5>
                    <p class="card-text">Same as last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card mb-3 card-size" :class="{ 
                'border-success': props.spent < props.goalExpenses,
                'border-light': props.spent == props.goalExpenses,
                'border-warning': props.spent > props.goalExpenses,
            }">
                <div class="card-header card-header-text">Total spent</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.spent }}</h5>
                    <p class="card-text">
                        <b>Goal:</b> ${{ props.goalExpenses }} ({{ getPercetage(props.spent, props.goalExpenses) }})
                    </p>
                    <p class="second-card-text">2% more than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card mb-3 card-size" :class="{ 
                'border-success': props.saved < props.goalSavings,
                'border-light': props.saved == props.goalSavings,
                'border-warning': props.saved > props.goalSavings,
            }">
                <div class="card-header card-header-text">Total saved</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.saved }}</h5>
                    <p class="card-text">
                        <b>Goal:</b> ${{ props.goalSavings }} ({{ getPercetage(props.saved, props.goalSavings) }})
                    </p>
                    <p class="second-card-text">3% less than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card mb-3 card-size" :class="{ 
                'border-success': props.paid < props.goalBills,
                'border-light': props.paid == props.goalBills,
                'border-warning': props.paid > props.goalBills,
            }">
                <div class="card-header card-header-text">Total paid</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.paid }}</h5>
                    <p class="card-text"><b>Goal:</b> ${{ props.goalBills }} ({{ getPercetage(props.paid, props.goalBills) }})</p>
                    <p class="second-card-text">5% more than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card mb-3 card-size" :class="{ 
                'border-success': props.totalIncome - props.spent - props.saved >= 0,
                'border-warning': props.totalIncome - props.spent - props.saved < 0,
            }">
                <div class="card-header card-header-text">Total left</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$ {{ 
                        // Bills are not added because they are included in spent
                        props.totalIncome - props.spent - props.saved
                    }}</h5>
                    <p class="card-text">2% more than last month</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from "vue"
import { getPrevExpensesTotal } from "@/functions/summaryAPI";

const props = defineProps({
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

const getPercetage = (total, goal) => 
    total < goal ? (100 - parseInt(total/goal * 100)) + "% under" : 
    total > goal ? (parseInt(total/goal * 100) - 100) + "% over" : "Achieved"

const prevExpensesTotal = ref(0)

const setPrevExpensesTotal = async () => {
    prevExpensesTotal.value = await getPrevExpensesTotal(props.currMonthInNum, props.currYear)
} 
setPrevExpensesTotal()
</script>

<style>
.card-size {
    width: 15rem;
    height: 11rem;
}

.card-header-text {
    font-size: 1.5rem;
}

.card-title-text {
    font-size: 1.5rem;
}

.second-card-text {
    margin-top: -0.5rem;
    font-size: 0.7rem;
}
</style>