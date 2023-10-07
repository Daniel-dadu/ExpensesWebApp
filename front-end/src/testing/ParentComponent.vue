<template>
    <div>
      <h2>Parent Component</h2>
      <input v-model="parentVariable" />
      <p>Value in Parent: {{ parentVariable }}</p>
      <ChildComponent v-model="parentVariable" />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import ChildComponent from './ChildComponent.vue';
  
  export default {
    components: {
      ChildComponent,
    },
    setup() {
      const parentVariable = ref(''); // Define the parent variable using ref
  
      return {
        parentVariable,
      };
    },
  };
  </script>
  