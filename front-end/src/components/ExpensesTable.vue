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
            <tr v-for="expense in expensesEdit" :key="expense._id">
                <td>{{ expense.date }}</td>
                <td>{{ expense.category }}</td>
                <td>{{ expense.description }}</td>
                <td>${{ expense.amount }}</td>
                <td>
                    <button 
                    type="button" 
                    class="btn btn-primary" 
                    data-bs-toggle="modal" 
                    :data-bs-target="'#Modal'+expense._id" 
                    >
                        More
                    </button>
                    <ExpenseModal 
                    :date="expense.date" 
                    :category="expense.category"
                    :description="expense.description"
                    :amount="expense.amount"
                    :id="expense._id"
                    :created-at="expense.createdAt"
                    :updated-at="expense.updatedAt"
                    />
                    <button 
                    type="button" 
                    class="btn btn-outline-danger" 
                    id="delete-expense-btn" 
                    @click="removeExpense(expense._id)"
                    >
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

</template>

<script>
import { ref } from "vue"
import { expenses } from '@/expenses-obj'
import ExpenseModal from './ExpenseModal.vue'

export default {
    name: "ExpensesTable",
    setup() {
        const expensesEdit = ref(expenses)

        function removeExpense(id) {
            expensesEdit.value = expensesEdit.value.filter(expense => expense._id != id)
        }

        return {
            expensesEdit,
            removeExpense,
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

#delete-expense-btn {
    margin-left: 2em;
    border: 0;
}
#delete-expense-btn img {
    filter:invert(82%) sepia(3%) saturate(473%) hue-rotate(179deg) brightness(93%) contrast(88%);
}
</style>