<template>
    <div class="input-group">
        <input 
            type="text" 
            class="form-control" 
            aria-label="Text input with dropdown button"
            v-model="selectedEdit"
            @keyup.enter="finishEditing"
            ref="textInput"
        >
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
        <ul class="dropdown-menu dropdown-menu-end">
            <li v-for="(element, idx) in elementsEdit" :key="idx">
                <a class="dropdown-item" @click="selectOtherElem(element)" style="cursor: pointer;">
                    {{ element }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from "vue"

const props = defineProps({
    elements: Array,
    modelValue: String,
    
    // For the ExpensesTable: //
    id: {
        type: [String, Number],
        required: true,
    },
    changedData: Function,
    // ---------------------- //
})
const emit = defineEmits(["update:modelValue"])

const elementsEdit = ref(props.elements)
const textInput = ref(null)

// To update categories when got a response from the backend
watch(
    () => props.elements, 
    (newVal) => {
        elementsEdit.value = newVal
    }
)

const selectedEdit = computed({
    get: () => props.modelValue,
    set: (newVal) => {
        emit("update:modelValue", newVal)
    }
})

const finishEditing = () => {
    let isInElements = false
    for (const elem of props.elements) {
        if (elem === selectedEdit.value) {
            isInElements = true
            break
        }
    }
    if (!isInElements) {
        elementsEdit.value.push(selectedEdit.value)
    }

    // Call changedData from ExpensesTable
    props.changedData(props.id)

    textInput.value.blur() // To unfocus the input text
}

const selectOtherElem = (newElem) => {
    selectedEdit.value = newElem
    emit("update:modelValue", newElem)
    // Call changedData from ExpensesTable
    props.changedData(props.id)
}
</script>