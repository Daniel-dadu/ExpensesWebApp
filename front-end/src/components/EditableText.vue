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
  
<script>
import { ref, watch, } from "vue"

export default {
	props: {
		initialText: {
			type: [String, Number],
			required: true,
		},
	},
	setup(props, { emit }) {
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
			emit("update:initialText", editedText.value)
		}

		// Watch for changes in props.initialText and update editedText
		watch(() => props.initialText, (newText) => {
			editedText.value = newText
		})

		return {
			isEditing,
			editedText,
			textInput,
			startEditing,
			finishEditing,
		}
	},
}
</script>
  
<style>
.editabletext-div {
	display: inline-flex;
}
</style>