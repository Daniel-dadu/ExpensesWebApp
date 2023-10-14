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
            <tr v-for="(category, index) in categoriesEdit" :key="index">
                <td>
                    {{ category.name }}
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
import { defineProps, ref, watch, } from "vue"

const props = defineProps({
    categories: Array,
})

const categoriesEdit = ref(props.categories)

watch(
    () => props.categories,
    (newCategories) => categoriesEdit.value = newCategories
)
</script>