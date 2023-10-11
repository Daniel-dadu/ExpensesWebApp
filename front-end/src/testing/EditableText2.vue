<template>
	<div v-if="!isEditing" @click="startEditing" class="editabletext-div">{{ editedText }}</div>
	<div v-else class="input-group editabletext-div">
		<input 
		type="text" 
		class="form-control" 
		v-model="editedText" 
		@keyup.enter="finishEditing" 
		ref="textInput">
	</div>
</template>
  
<script setup>
import { ref, watch, defineProps, defineEmits, } from "vue"

const props = defineProps({
	initialText: {
		type: [String, Number],
		required: true,
	},

	// For ExpensesTable //
	index: {
		type: [String, Number],
		required: false,
	},
	inputVar: { // This helps to identify the expense property edited
		type: String,
		required: false,
	},
	// ----------------- //
})
const emit = defineEmits(["update:initialText"])

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
	emit("update:initialText", editedText.value, props.index, props.inputVar)
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