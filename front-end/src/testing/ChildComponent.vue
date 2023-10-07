<template>
    <div>
      <h2>Child Component</h2>
      <input v-model="childValue" />
      <p>Value in Child: {{ childValue }}</p>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    props: {
      modelValue: String, // Define a prop to receive the parent's variable
    },
    setup(props, { emit }) {
      const childValue = ref(props.modelValue); // Initialize with the parent's value
  
      // Watch for changes in the parent's variable and update the childValue
      watch(() => props.modelValue, (newValue) => {
        childValue.value = newValue;
      });
  
      // Emit changes in childValue to the parent using the update:modelValue event
      watch(() => childValue.value, (newValue) => {
        emit('update:modelValue', newValue);
      });
  
      return {
        childValue,
      };
    },
  };
  </script>
  