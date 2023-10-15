<template>
<table class="table table-hover align-middle my-table">
        <thead>
            <tr>
                <th>Category</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(category, index) in props.categories" :key="index">
                <td>
                    <EditableText 
						:initial-text="category.name" 
						:index="index"
						:input-var="'name'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    <EditableText 
						:initial-text="category.limit" 
						:index="index"
						:input-var="'limit'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    $ {{ getSpentInBudget(category.name) }}
                </td>
                <td>
                    $1500
                </td>
                <td>
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
import { defineProps, defineEmits, } from "vue"
import EditableText from "../ReusableComponents/EditableText.vue"

const props = defineProps({
    categories: Array,
    expenses: Array,
})

const emit = defineEmits(["update:categories"])

const updateEditableText = (newVal, idx, inputVar) => {
    // To deep copy the array
    let newBudgets = props.categories.map(i => ({...i}))
	newBudgets[idx][inputVar] = newVal
    emit("update:categories", newBudgets)
}

const getSpentInBudget = (name) => {
    let cont = 0
    return props.expenses.reduce(
        (acc, currExp) => currExp.category == name ? acc + parseFloat(currExp.amount) : acc, 
        cont
    )
}
</script>