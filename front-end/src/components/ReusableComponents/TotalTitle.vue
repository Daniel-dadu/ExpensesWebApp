<template>
    <div class="total-title">
        <p class="fw-light fst-italic">
            {{ props.title }}
        </p>
        <p class="fw-medium fs-3">
            <span>$</span>{{ numTwoDecimals(props.amount) }}
        </p>
    </div>
</template>

<script setup>
import { defineProps } from "vue"
import { numTwoDecimals } from "../../functions/formatNumbers"

const props = defineProps({
    title: String,
    amount: Number,
})
</script>

<style>
.total-title p {
    margin-bottom: 0%;
    text-align: center;
}
.total-title p span {
    margin-right: 0.2rem;
}
</style>