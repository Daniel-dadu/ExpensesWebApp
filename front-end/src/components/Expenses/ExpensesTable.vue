<template>
    <div class="add-table-elem-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addExpense">
            Add Expense
        </button>
    </div>
    <table class="table table-hover align-middle my-table" id="expenses-table">
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
            <tr v-for="(expense, index) in props.expenses" :key="index">
                <td>
                    <Datepicker 
						v-model="expense.date" 
						:enable-time-picker="false" 
                        :min-date="new Date(2023, props.currMonthInNum, 1)"
                        :max-date="new Date(2023, props.currMonthInNum+1, 0)"
						class="dp__theme_dark" 
						:dark="true"
                    >
						<template #trigger>
							<button type="button" class="btn btn-dark">
								{{expense.date.toGMTString().substring(0, 16)}}
							</button>
						</template>
					</Datepicker>
                </td>
                <td>
                    <DropdownSelector 
						:elements="categoriesEdit" 
						@update:elements="updateCategories"
						:initial-elem="expense.category"
						@update:initial-elem="updateCategorySelected"
						:index="index" 
						:updateDataInBackend="props.updateDataInBackend" 
                    />
                </td>
                <td>
                    <EditableText 
						:initialText="expense.description" 
						:index="index"
						:input-var="'description'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    <div class="expenses-amount-text">
                        <span>$</span>
                        <EditableText 
							:initial-text="numTwoDecimals(expense.amount)" 
							:index="index"
							:input-var="'amount'" 
							@update:initial-text="updateEditableText"
                        />
                    </div>
                </td>
                <td>
                    <button 
						type="button" 
						class="btn btn-outline-light" 
						data-bs-toggle="modal" 
						:data-bs-target="'#Modal'+index" 
                    >
                        More
                    </button>
                    <ExpenseModal 
						:index="index"
						:initial-data="expense"
						:update-editable-text="updateEditableText"
						:changed-data="props.updateDataInBackend"
						:categories-data="categoriesEdit"
						:update-categories="updateCategories"
						:update-category-selected="updateCategorySelected"
						:on-changed-date="onChangedDate"
						:remove-expense="removeExpense"
                    />
                    <button 
						type="button" 
						class="btn btn-outline-danger table-delete-btn"  
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
import { ref, defineProps, defineEmits, watch, } from "vue"
import ExpenseModal from "./ExpenseModal.vue"
import EditableText from "../ReusableComponents/EditableText.vue"
import Datepicker from "@vuepic/vue-datepicker"
import DropdownSelector from "../ReusableComponents/DropdownSelector.vue"
import { numTwoDecimals } from "../../functions/formatNumbers"

const props = defineProps({
    expenses: Array,
    categories: Array, // Every element is {name: String, limit: Number}
    updateDataInBackend: Function,
    // To only allow the user to select dates on the month from MonthSelector:
    currMonthInNum: Number, 
    updateTotalSpent: Function,
})

const emit = defineEmits(["update:expenses", "update:categories"])

// This will only have the names, not the limit amount
const categoriesEdit = ref(props.categories.map(budget => budget.name))

watch(
    () => props.categories,
    (newBudget) => {
        categoriesEdit.value = newBudget.map(budget => budget.name)
    },
    { deep: true } // To watch for changes inside the budget object
)

// Called when any DropdownSelector is updated inside the table and modal
const updateCategorySelected = (newCat, idx) => {
    emit("update:expenses", "field", idx, "category", newCat)
}

const updateCategories = (newBudget) => {
	categoriesEdit.value.push(newBudget)
    // Adding the new as an object with its limit
    emit("update:categories", [...props.categories, {name: newBudget, limit: 0}])
}

// Called when any EditableText is updated inside the table and modal
const updateEditableText = (newVal, idx, inputVar) => {
    emit("update:expenses", "field", idx, inputVar, newVal)
    if(inputVar == "amount") {
        props.updateTotalSpent()
    }
}

const removeExpense = (idx) => {
    const object_id = props.expenses[idx]._id
    emit("update:expenses", "remove", idx)
    props.updateDataInBackend("removeExpense", null, object_id)
}

const addExpense = () => {
    let newExpense = { 
        "userId": window.localStorage.getItem("email"),
        "date": new Date(),
        "category": null,
        "description": "Add description",
        "amount": 0,
        "createdAt": new Date(),
        "updatedAt": new Date(),
    }
    props.updateDataInBackend("addExpense", 0, newExpense)
    emit("update:expenses", "add", null, null, newExpense)
}

const onChangedDate = () => {
    // Sort the table by the date
    emit("update:expenses", "sort")
}
</script>


<style>
#expenses-table tr td:first-child {
    width: 1%;
    white-space: nowrap;
}

.add-table-elem-div {
    display: flex; 
    justify-content: flex-end;
}

.expenses-amount-text {
	display: flex;
    align-items: center;
}
.expenses-amount-text button, .expenses-amount-text input {
	padding-left: 0.2rem;
	padding-right: 0.2rem;
}
</style>