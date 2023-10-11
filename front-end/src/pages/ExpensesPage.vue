<template>
    <div id="expenses-page">
        <p class="h3" id="expenses-page-title">Expenses page</p>
        <ExpensesTable />
    </div>
</template>

<script setup>
import ExpensesTable from "../components/ExpensesTable.vue"
</script>

<style>
#expenses-page {
    padding: 2rem;
}

#expenses-page-title {
    margin-bottom: 2rem;
}
</style>