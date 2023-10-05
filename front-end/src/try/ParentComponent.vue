<!-- ParentComponent.vue -->
<template>
    <table>
      <thead>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
          <!-- Add more headers as needed -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataArray" :key="index">
          <!-- Use the child component in each cell -->
          <ChildComponent :data="item.field1" />
          <ChildComponent :data="item.field2" />
          <!-- Add more cells and props as needed -->
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  import ChildComponent from "./ChildComponent.vue"; // Adjust the path as needed
  
  export default {
    components: {
      ChildComponent,
    },
    data() {
      return {
        dataArray: [
          { field1: "Data A1", field2: "Data A2" },
          { field1: "Data B1", field2: "Data B2" },
          // Add more objects as needed
        ],
      };
    },
  };
  </script>
  