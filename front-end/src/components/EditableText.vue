<template>
    <div v-if="!isEditing" @click="startEditing">{{ text }}</div>
    <input v-else v-model="editedText" @keyup.enter="finishEditing" ref="textInput" />
  </template>
  
  <script>
  import { ref, watch, nextTick } from "vue";
  
  export default {
    props: {
      text: String, // The initial text
    },
    setup(props, { emit }) {
      const isEditing = ref(false);
      const editedText = ref(props.text);
      const textInputRef = ref(null);
  
      const startEditing = () => {
        isEditing.value = true;
        editedText.value = props.text;
        // Use watch to wait for textInputRef to become available
        watch(
          () => textInputRef.value,
          (newValue) => {
            if (newValue) {
              // Focus the input field
              nextTick(() => {
                newValue.focus();
              });
            }
          }
        );
      };
  
      const finishEditing = () => {
        isEditing.value = false;
        // Use `emit` from `defineEmits` to emit the event
        emit("update:text", editedText.value);
      };
  
      return {
        isEditing,
        editedText,
        textInputRef,
        startEditing,
        finishEditing,
      };
    },
  };
  </script>
  