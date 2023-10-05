<!-- ChildComponent.vue -->
<template>
    <td>{{ data }}</td>
  </template>
  
  <script>
  export default {
    props: {
      data: String, // The data to display in the cell
    },
  };
  </script>
  