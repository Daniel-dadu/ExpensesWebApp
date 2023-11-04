<template>
    <div class="row row-cols-auto justify-content-md-center">
        <div class="col">
            <div class="card border-success mb-3 card-size">
                <div class="card-header card-header-text">Total Income</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.totalIncome }}</h5>
                    <p class="card-text">Same as last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-light mb-3 card-size">
                <div class="card-header card-header-text">Total spent</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.spent }}</h5>
                    <p class="card-text"><b>Goal:</b> ${{ props.goalExpenses }} (3% over)</p>
                    <p class="second-card-text">2% more than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-warning mb-3 card-size">
                <div class="card-header card-header-text">Total saved</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.saved }}</h5>
                    <p class="card-text"><b>Goal:</b> ${{ props.goalSavings }} (5% over)</p>
                    <p class="second-card-text">3% less than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-warning mb-3 card-size">
                <div class="card-header card-header-text">Total paid</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">${{ props.paid }}</h5>
                    <p class="card-text"><b>Goal:</b> ${{ props.goalBills }} (3% under)</p>
                    <p class="second-card-text">5% more than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-warning mb-3 card-size">
                <div class="card-header card-header-text">Total left</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$1,500</h5>
                    <p class="card-text">2% more than last month</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue"

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