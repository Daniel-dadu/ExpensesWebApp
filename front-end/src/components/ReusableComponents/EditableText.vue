<template>
	<button 
		v-if="!isEditing" 
		type="button" 
		@click="startEditing" 
		class="btn btn-dark editabletext-div"
	>
		{{ editedText }}
	</button>
	<div v-else class="input-group editabletext-div">
		<input 
			type="text" 
			class="form-control" 
			v-model="editedText" 
			@keyup.enter="finishEditing" 
			ref="textInput"
		>
	</div>
</template>
  
<script setup>
import { ref, watch, defineProps, defineEmits, } from "vue"

const props = defineProps({
	initialText: {
		type: [String, Number],
		required: true,
	},

	// Optional (used in some tables) //
	index: {
		type: [String, Number],
		required: false,
	},
	inputVar: { // This helps to identify the expense property edited
		type: String,
		required: false,

	},
	// ----------------- //
	// For TableBudget //
	// isBudgetName: {
	// 	type: Boolean,
	// 	default: false,
	// }
})
const emit = defineEmits(["update:initial-text"])

const isEditing = ref(false)
const editedText = ref(props.initialText)
const textInput = ref(null)

const startEditing = () => {
	isEditing.value = true
	editedText.value = props.initialText

	// Wait for textInputRef to become available
	watch(
		() => textInput.value,
		(newValue) => {
			try { newValue.focus() } // Focus the input field
			catch (error) { error } // Just ignoring the error
		}
	)
}

const finishEditing = () => {
	isEditing.value = false
	emit(
		"update:initial-text", 
		editedText.value, 
		props.index, 
		props.inputVar, 
		props.initialText, // to indicate the previous value (used only in TableBudget)
	)
}

// Watch for changes in props.initialText and update editedText
watch(
	() => props.initialText, 
	(newText) => {
		editedText.value = newText
	}
)
</script>
  
<style>
.editabletext-div {
	display: inline-flex;
}
</style>