<template>
    <div class="add-table-elem-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addBudget">
            Add Budget
        </button>
    </div>
    <table class="table table-hover align-middle my-table">
        <thead>
            <tr>
                <th>Category</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Left</th>
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
                    $ <EditableText 
						:initial-text="category.limit" 
						:index="index"
						:input-var="'limit'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    $ {{ props.amountsSpentInBudgets[index] }}
                </td>
                <td>
                    $ {{ category.limit - props.amountsSpentInBudgets[index] }}
                </td>
                <td>
                    <button 
						type="button" 
						class="btn btn-outline-danger table-delete-btn"  
						@click="removeCategory(index)"
                    >
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    <div 
        v-if="showToast"
        class="toast align-items-center text-bg-danger bottom-left-toast" 
        style="display: block;"
    >
        <div class="d-flex">
            <div class="toast-body">
                Remove the expenses that use this budget category or change their budget category to be able to remove it.
            </div>
            <button 
                type="button" 
                class="btn-close me-2 m-auto"
                @click="() => showToast = false"
            ></button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, } from "vue"
import EditableText from "../ReusableComponents/EditableText.vue"

const props = defineProps({
    categories: Array,
    expenses: Array,
    amountsSpentInBudgets: Array,
})

const emit = defineEmits(["update:categories"])

const showToast = ref(false)

const updateEditableText = (newVal, idx, inputVar) => {
    emit("update:categories", "update", newVal, idx, inputVar)
}

const addBudget = () => {
    emit("update:categories", "add", {
        name: "Add a name",
        limit: 0,
    })
}

const removeCategory = (idx) => {
    for (const exp of props.expenses) {
        if(exp.category == props.categories[idx].name) {
            showToast.value = true
            return
        }
    }

    // If there is an active toast, close it
    showToast.value = false

    emit("update:categories", "remove", null, idx)
}
</script>

<style>
.bottom-left-toast {
    display: block;
    position: fixed;
    bottom: 20px; /* Adjust this value to control the distance from the bottom */
    right: 20px; /* Adjust this value to control the distance from the right */
    z-index: 999; /* Adjust the z-index as needed */
}
</style>