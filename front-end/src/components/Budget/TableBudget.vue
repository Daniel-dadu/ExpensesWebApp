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
            <tr v-for="(category, index) in budgetEdit" :key="index">
                <td>
                    <EditableText 
						:initial-text="category.name" 
						:index="index"
						:input-var="'name'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    {{ category.limit }}
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
import { defineProps, defineEmits, ref, watch, } from "vue"
import EditableText from "../ReusableComponents/EditableText.vue"

const props = defineProps({
    categories: Array,
})

const emit = defineEmits(["update:categories"])

const budgetEdit = ref(props.categories)

watch(
    () => props.categories,
    (newBudget) => budgetEdit.value = newBudget
)

const updateEditableText = (newVal, idx, inputVar) => {
	budgetEdit.value[idx][inputVar] = newVal
    emit("update:categories", budgetEdit.value)
}
</script>