<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="expense in expenses" :key="expense._id">
                <td>{{ expense.date }}</td>
                <td>{{ expense.category }}</td>
                <td>{{ expense.description }}</td>
                <td>{{ expense.amount }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { expenses } from '@/expenses-obj';

export default {
    name: "ExpensesTable",
    data() {
        return {
            expenses,
        }
    }
}
</script>