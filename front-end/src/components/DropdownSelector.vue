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

<script>
import { ref, } from 'vue'

export default {
    props: {
        elements: Array,
        selected: String,
    },
    setup(props) {
        const elementsEdit = ref(props.elements)

        const selectedEdit = ref(props.selected)
		
        const textInput = ref(null)

        const finishEditing = () => {
            let isInElements = false
            for (const elem of props.elements) {
                if(elem === selectedEdit.value) {
                    isInElements = true
                    break
                }
            }
            if(!isInElements) {
                elementsEdit.value.push(selectedEdit.value)
            }
            
            textInput.value.blur() // To unfocus the input text
        }

        const selectOtherElem = (newElem) => {
            selectedEdit.value = newElem
        }

        return {
            elementsEdit,
            selectedEdit,
            textInput,
            finishEditing,
            selectOtherElem,
        }
    },

}

</script>