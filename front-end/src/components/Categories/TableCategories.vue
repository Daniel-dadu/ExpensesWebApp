<template>
    <div class="add-table-elem-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addCategory">
            Add {{ 
                props.categType === "budget" ? "budget" 
                : props.categType === "saving" ? "saving"
                : props.categType === "bill" ? "bill" :
                "Error"
            }}
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
						:initial-text="category.threshold" 
						:index="index"
						:input-var="'threshold'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    $ {{ props.amountsUsed[index] }}
                </td>
                <td>
                    $ {{ category.threshold - props.amountsUsed[index] }}
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
        v-if="props.categories.length === 0" 
        class="import-btn"
    >
        <button
            type="button"
            class="btn btn-outline-secondary"
            @click="props.importPrev(props.categType)"
        >
            Import from last month
        </button>
    </div>
    <div 
        v-if="showToast"
        class="toast align-items-center text-bg-danger bottom-left-toast" 
        style="display: block;"
    >
        <div class="d-flex">
            <div class="toast-body">
                Remove the expenses that use this category or change their category to be able to remove it.
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
    categType: String,
    categories: Array,
    expenses: Array,
    amountsUsed: Array,
    importPrev: Function,
})

const emit = defineEmits(["update:categories", "update:expenses"])

const showToast = ref(false)

const updateEditableText = (newVal, idx, inputVar, prevVal) => {
    if (inputVar === "threshold") {
        newVal = parseFloat(newVal)
    }

    emit("update:categories", "update", newVal, idx, inputVar)

    if(inputVar === "name") {
        // Update the name of the category in the expenses     
        for (let i = 0; i < props.expenses.length; i++) {
            if(prevVal === props.expenses[i].category) {
                emit("update:expenses", "update", newVal, i, "category")
            }
        }
    }
}

const addCategory = () => {
    emit("update:categories", "add", {
        name: "Add a name",
        threshold: 0,
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

.import-btn {
    width: fit-content;
    margin: auto;
    margin-top: 2rem;
}
</style>