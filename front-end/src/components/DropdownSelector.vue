<template>
    <div class="input-group mb-3">
        <input 
        type="text" 
        class="form-control" 
        aria-label="Text input with dropdown button"
        v-model="selectedElem"
        @keyup.enter="finishEditing"
        ref="textInput"
        >
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" ref="Tbtn"></button>
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
        const selectedElem = ref(props.selected)
		const textInput = ref(null)
        const Tbtn = ref(null)

        const finishEditing = () => {
            console.log(selectedElem.value)
            for (const elem of props.elements) {
                if(elem === selectedElem.value) return
            }
            elementsEdit.value.push(selectedElem.value)
            
            textInput.value.blur() // To unfocus the input text
        }

        const selectOtherElem = (newElem) => {
            selectedElem.value = newElem
        }

        return {
            elementsEdit,
            selectedElem,
            textInput,
            finishEditing,
            selectOtherElem,
            Tbtn,
        }
    },

}

</script>