<template>
    <div id="add-expense-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addExpense">
            Add Expense
        </button>
    </div>
    <table class="table table-hover align-middle" id="expenses-table">
        <thead>
            <tr>
                <th style="width: 15%;">Date</th>
                <th style="width: 20%;">Category</th>
                <th style="width: 40%;">Description</th>
                <th style="width: 10%;">Amount</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(expense, index) in expensesEdit" :key="index">
                <td>
                    <Datepicker 
                    v-model="expense.date" 
                    :enable-time-picker="false" 
                    class="dp__theme_dark" 
                    :dark="true" 
                    />
                </td>
                <td>
                    <DropdownSelector 
                    :elements="categoriesEdit" 
                    v-model="expense.category" 
                    :id="index" 
                    :changedData="changedData" 
                    />
                </td>
                <td>
                    <EditableText 
						:initialText="expense.description" 
						:index="index"
						:input-var="'description'" 
						@update:initialText="updateEditableText"
                    />
                </td>
                <td>
                    <div class="expenses-amount-text">
                        <span>$</span>
                        <EditableText 
							:initial-text="expense.amount" 
							:index="index"
							:input-var="'amount'" 
							@update:initialText="updateEditableText"
                        />
                    </div>
                </td>
                <td>
                    <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    data-bs-toggle="modal" 
                    :data-bs-target="'#TModal'+index" 
                    >
                        More
                    </button>
                    <ExpenseModal 
                    :index="index"
                    :initial-data="expense"
					:update-editable-text="updateEditableText"
                    :changed-data="changedData"
                    :categories-data="categoriesEdit"
                    :on-changed-date="onChangedDate"
                    :remove-expense="removeExpense"
                    />
                    <button 
                    type="button" 
                    class="btn btn-outline-danger delete-expense-btn"  
                    @click="removeExpense(index)"
                    >
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import ExpenseModal from "./ExpenseModal2.vue"
import EditableText from "./EditableText2.vue"
import Datepicker from "@vuepic/vue-datepicker"
import DropdownSelector from "./DropdownSelector2.vue"

const expensesEdit = ref([])
const getAPIExpenses = async () => {
    try {
        const response = await axios.get("/api/expenses")
        expensesEdit.value = response.data
    } catch (error) {
        console.log(error)
    }
} 
getAPIExpenses() // Get expenses when loading component

const categoriesEdit = ref([])
const getAPICategories = async () => {
    try {
        const response = await axios.get("/api/categories")
        categoriesEdit.value = response.data
    } catch (error) {
        console.log(error)
    }
}
getAPICategories() // Get categories when loading component

// Called when any EditableText is updated inside the table and modal
const updateEditableText = (newVal, idx, inputVar) => {
	expensesEdit.value[idx][inputVar] = newVal
}

// Function called from the modal, executed when the data is changed
const changedData = (idx) => {
    console.log("Send a PUT here")
    console.log(expensesEdit.value[idx])
}

const removeExpense = (idx) => {
    expensesEdit.value.splice(idx, 1)
}

const addExpense = () => {
    // Adding it at the beginning of the array
    expensesEdit.value.unshift({
        "userId": "5f93e3e2c4e187001cc9244a", // CHANGE THIS
        "date": new Date(),
        "category": null,
        "description": "Add description",
        "amount": 0,
        "createdAt": new Date(),
        "updatedAt": new Date()
    })
}

const onChangedDate = () => {
    // Sort the table by the date
    expensesEdit.value.sort((a, b) => a.date < b.date ? 1 : -1)
}

// To sort the table when the component is loaded:
onChangedDate()
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

.delete-expense-btn {
    margin-left: 1em;
    border: 0;
}
.delete-expense-btn img {
    /* To turn the svg to a lighter color */
    filter:invert(82%) sepia(3%) saturate(473%) hue-rotate(179deg) brightness(93%) contrast(88%);
}

#add-expense-div {
    margin-top: 1rem;
    display: flex; 
    justify-content: flex-end;
}

.expenses-amount-text {
    display: flex;
    align-items: center;
}
.expenses-amount-text span {
    margin-right: .2rem;
}
</style>