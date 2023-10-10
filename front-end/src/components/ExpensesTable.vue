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
                <td>
                    <Datepicker 
                    v-model="expense.date" 
                    :enable-time-picker="false" 
                    class="dp__theme_dark" 
                    :dark="true" 
                    />
                </td>
                <td>
                    <DropdownSelector :elements="categoriesEdit" v-model="expense.category" :id="_id" :changedData="changedData" />
                </td>
                <td>
                    <EditableText :initialText="expense.description" @update:initialText="expense.description = $event"/>
                </td>
                <td>
                    <EditableText :initialText="expense.amount" @update:initialText="expense.amount = $event"/>
                </td>
                <td>
                    <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    data-bs-toggle="modal" 
                    :data-bs-target="'#Modal'+_id" 
                    >
                        More
                    </button>
                    <ExpenseModal 
                    :id="_id"
                    :initialData="expense"
                    :changedData="changedData"
                    :categoriesData="categoriesEdit"
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
    <div id="add-expense-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addExpense">
            Add Expense
        </button>
    </div>

</template>

<script>
import { ref } from "vue"
import { expenses } from '@/expenses-obj'
import ExpenseModal from './ExpenseModal.vue'
import EditableText from "./EditableText.vue"
import Datepicker from '@vuepic/vue-datepicker'
import DropdownSelector from "./DropdownSelector.vue"

export default {
    setup() {
        const lastKeyEdit = ref(expenses.lastKey)
        const categoriesEdit = ref(expenses.categories)
        delete expenses.lastKey // To only print the keys that are Expenses
        delete expenses.categories // To only print the keys that are Expenses
        const expensesEdit = ref(expenses)

        // Function called from the modal, executed when the data is changed
		const changedData = (id) => {
			console.log("Send a PUT here")
			console.log(expensesEdit.value[id])
		}
    
        const removeExpense = (id) => {
            delete expensesEdit.value[id]
        }

        const addExpense = () => {
            expensesEdit.value[++lastKeyEdit.value] = {
                "userId": "5f93e3e2c4e187001cc9244a",
                "date": new Date(),
                "category": null,
                "description": "Add description",
                "amount": 0,
                "createdAt": new Date(),
                "updatedAt": new Date()
            }
        }

        return {
            lastKeyEdit,
            categoriesEdit,
            expensesEdit,
            changedData,
            removeExpense,
            addExpense,
        }
    },
    components: {
        ExpenseModal,
        EditableText,
        Datepicker,
        DropdownSelector,
    },
}
</script>

<style>
#expenses-table tr td:last-child {
    width: 1%;
    white-space: nowrap;
}
#expenses-table tr td:first-child {
    width: 1%;
    white-space: nowrap;
}

#delete-expense-btn {
    margin-left: 1em;
    border: 0;
}
#delete-expense-btn img {
    /* To turn the svg to a lighter color */
    filter:invert(82%) sepia(3%) saturate(473%) hue-rotate(179deg) brightness(93%) contrast(88%);
}

#add-expense-div {
    margin-top: 1rem;
    display: flex; 
    justify-content: flex-end;
}
</style>