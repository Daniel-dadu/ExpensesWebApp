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
                        @update:model-value="onDateSubmit(index)"
						:enable-time-picker="false" 
                        :min-date="new Date(props.currYear, props.currMonthInNum, 1)"
                        :max-date="new Date(props.currYear, props.currMonthInNum+1, 0)"
						class="dp__theme_dark" 
						:dark="true"
                    >
						<template #trigger>
							<button type="button" class="btn btn-dark">
								{{expense.date.toDateString()}}
							</button>
						</template>
					</Datepicker>
                </td>
                <td>
                    <DropdownSelector 
						:elements="categoriesArrayEdit" 
						@update:elements="updateCategories"
						:initial-elem="expense.category"
						@update:initial-elem="updateCategorySelected"
						:index="index" 
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
                    <div class="div-amount-text">
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
						:categories-data="categoriesArrayEdit"
						:update-categories="updateCategories"
						:update-category-selected="updateCategorySelected"
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
    currMonthInNum: Number, 
    currYear: Number,
})

const emit = defineEmits(["update:expenses", "update:categories"])

// This will only have the names, not the limit amount
const categoriesArrayEdit = ref(props.categories.map(budget => budget.name))

watch(
    () => props.categories,
    (newBudget) => {
        categoriesArrayEdit.value = newBudget.map(budget => budget.name)
    },
    { deep: true } // To watch for changes inside the budget object
)

// Called when any DropdownSelector is updated inside the table and modal
const updateCategorySelected = (newCat, idx) => {
    emit("update:expenses", "update", newCat, idx, "category")
}

const updateCategories = (newBudget) => {
    let categType

    if (!window.confirm("Is this a budget category?")) {
        if (!window.confirm("Is this a saving category?")) {
            categType = "bill"
        } else {
            categType = "saving"
        }
    } else {
        categType = "budget"
    }

    if (categType === "budget") {
        const idxFirstSeparator = categoriesArrayEdit.value.indexOf("")
        categoriesArrayEdit.value.splice(idxFirstSeparator, 0, newBudget)
    } else if (categType === "saving") {
        const idxLastSeparator = categoriesArrayEdit.value.lastIndexOf("")
        categoriesArrayEdit.value.splice(idxLastSeparator, 0, newBudget)
    } else {
        categoriesArrayEdit.value.push(newBudget)
    }

    // Adding the new as an object with its threshold
    emit("update:categories", categType, "add", {
        name: newBudget,
        threshold: 0,
    })
}

// Called when any EditableText is updated inside the table and modal
const updateEditableText = (newVal, idx, inputVar) => {
    if(inputVar === "amount") { newVal = parseFloat(newVal) }
    emit("update:expenses", "update", newVal, idx, inputVar)
}

const removeExpense = (idx) => {
    emit("update:expenses", "remove", null, idx)
}

const addExpense = () => {
    const validDate = () => {
        const d = new Date(
            props.currYear, 
            props.currMonthInNum, 
            new Date().getDate() // Today's day
        )
        
        return d.getMonth() == props.currMonthInNum ? d :
            new Date(props.currYear, props.currMonthInNum + 1, 0)
    }

    let newExpense = { 
        "userId": window.localStorage.getItem("email"),
        "date": validDate(),
        "category": null,
        "description": "Add description",
        "amount": 0.0,
        "createdAt": new Date(),
        "updatedAt": new Date(),
    }
    emit("update:expenses", "add", newExpense)
}

// When date is changed manually
const onDateSubmit = (idx) => {
    emit("update:expenses", "update", props.expenses[idx].date, idx, "date")
    emit("update:expenses", "sort")
}
</script>


<style>
#expenses-table tr td:first-child {
    width: 1%;
    white-space: nowrap;
}
</style>