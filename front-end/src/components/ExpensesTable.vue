<template>
    <table class="table table-hover align-middle" id="expenses-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="expense in expenses" :key="expense._id">
                <td>{{ expense.date }}</td>
                <td>{{ expense.category }}</td>
                <td>{{ expense.description }}</td>
                <td>{{ expense.amount }}</td>
                <td>
                    <button 
                    type="button" 
                    class="btn btn-primary" 
                    data-bs-toggle="modal" 
                    data-bs-target="#exampleModal"
                    >
                        Launch demo modal
                    </button>
                    <ExpenseModal />
                </td>
            </tr>
        </tbody>
    </table>

</template>

<script>
import { expenses } from '@/expenses-obj';
import ExpenseModal from './ExpenseModal.vue';

export default {
    name: "ExpensesTable",
    data() {
        return {
            expenses,
            content: "Initial Text",
        }
    },
    components: {
        ExpenseModal,
    },
}
</script>

<style>
#expenses-table tr td:last-child {
    width: 1%;
    white-space: nowrap;
}
</style>