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
            <tr v-for="(expense, _id) in expensesEdit" :key="_id">
                <td>{{ expense.date }}</td>
                <td>{{ expense.category }}</td>
                <td>{{ expense.description }}</td>
                <td>
                    <EditableText :initialText="expense.amount" @update:initialText="expense.amount = $event"/>
                    ${{ expense.amount }}
                </td>
                <td>
                    <button 
                    type="button" 
                    class="btn btn-primary" 
                    data-bs-toggle="modal" 
                    :data-bs-target="'#Modal'+_id" 
                    >
                        More
                    </button>
                    <ExpenseModal 
                    :id="_id"
                    :initialData="expense"
                    @updateContent="updateContent(_id, $event)"
                    />
                    <button 
                    type="button" 
                    class="btn btn-outline-danger" 
                    id="delete-expense-btn" 
                    @click="removeExpense(_id)"
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
import EditableText from "./EditableText.vue"

export default {
    name: "ExpensesTable",
    setup() {
        const lastKeyEdit = ref(expenses.lastKey)
        // To only print the keys that are Expenses
        delete expenses.lastKey
        const expensesEdit = ref(expenses)

        const updateContent = (id, newContent) => {
            expensesEdit.value[id] = newContent
        }
    
        const removeExpense = id => {
            delete expensesEdit.value[id]
        }

        return {
            lastKeyEdit,
            expensesEdit,
            updateContent,
            removeExpense,
        }
    },
    components: {
        ExpenseModal,
        EditableText,
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
    /* To turn the svg to a lighter color */
    filter:invert(82%) sepia(3%) saturate(473%) hue-rotate(179deg) brightness(93%) contrast(88%);
}
</style>