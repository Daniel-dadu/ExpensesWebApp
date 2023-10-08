<template>
	<div v-if="!isEditing" @click="startEditing">{{ editedText }}</div>
	<input v-else v-model="editedText" @keyup.enter="finishEditing" ref="textInput" />
</template>
  
<script>
import { ref, watch, nextTick } from "vue"

export default {
	props: {
		initialText: String,
	},
	setup(props, { emit }) {
		const isEditing = ref(false)
		const editedText = ref(props.initialText)
		const textInputRef = ref(null)

		const startEditing = () => {
			isEditing.value = true
			editedText.value = props.initialText
			
			// Wait for textInputRef to become available
			watch(
				() => textInputRef.value,
				(newValue) => {
					// Focus the input field
					nextTick(() => { newValue.focus() })
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
			textInputRef,
			startEditing,
			finishEditing,
		}
	},
}
</script>
  