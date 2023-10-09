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
                <td>
                    <EditableText :initialText="expense.description" @update:initialText="expense.description = $event"/>
                </td>
                <td>
                    <EditableText :initialText="expense.amount" @update:initialText="expense.amount = $event"/>
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
                    :changedData="changedData"
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
    setup() {
        const lastKeyEdit = ref(expenses.lastKey)
        delete expenses.lastKey // To only print the keys that are Expenses
        const expensesEdit = ref(expenses)

        // Function called from the modal, executed when the data is changed
		const changedData = (id) => {
			console.log("Send a PUT here")
			console.log(expensesEdit.value[id])
		}
    
        const removeExpense = id => {
            delete expensesEdit.value[id]
        }

        return {
            lastKeyEdit,
            expensesEdit,
            changedData,
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