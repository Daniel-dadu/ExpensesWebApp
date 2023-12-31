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
import { ref, watch, defineProps, defineEmits } from "vue"

const props = defineProps({
    elements: Array,
    initialElem: String,
    
    // For the ExpensesTable: //
    index: {
        type: [String, Number],
        required: false,
    },
    changedData: {
        type: Function,
        required: false
    },
    // ---------------------- //
})
const emit = defineEmits(["update:initial-elem", "update:elements"])

const elementsEdit = ref(props.elements)
const selectedEdit = ref(props.initialElem)
const textInput = ref(null)

// To update categories when got a response from the backend
watch(
    () => props.elements, 
    (newVal) => {
        elementsEdit.value = newVal
    }
)

// To keep selectedEdit updated
watch(
    () => props.initialElem, 
    (newVal) => {
        selectedEdit.value = newVal
    }
)

const finishEditing = () => {
    let isInElements = false
    for (const elem of elementsEdit.value) {
        if (elem === selectedEdit.value) {
            isInElements = true
            break
        }
    }

    // Update the value in the Table
    emit("update:initial-elem", selectedEdit.value, props.index)

    if (!isInElements) {        
        // Update the categories in general
        emit("update:elements", selectedEdit.value)
    }

    // Call changedData from ExpensesTable
    props.changedData(props.index)

    textInput.value.blur() // To unfocus the input text
}

const selectOtherElem = (newElem) => {
    // Update the value in the Table
    emit("update:initial-elem", newElem, props.index)
    // Call changedData from ExpensesTable
    props.changedData(props.index)
}
</script>