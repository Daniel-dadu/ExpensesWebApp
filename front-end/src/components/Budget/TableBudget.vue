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
                    $500
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
})

const emit = defineEmits(["update:categories"])

const updateEditableText = (newVal, idx, inputVar) => {
    // To deep copy the array
    let newBudgets = JSON.parse(JSON.stringify(props.categories))
	newBudgets[idx][inputVar] = newVal
    emit("update:categories", newBudgets)
}
</script>