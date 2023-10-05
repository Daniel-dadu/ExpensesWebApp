<template>
    <div v-if="!isEditing" @click="startEditing">{{ text }}</div>
    <input v-else v-model="editedText" @keyup.enter="finishEditing" ref="textInput" />
</template>
  
<script>
export default {
    data() {
        return {
            isEditing: false,
            editedText: "",
        };
    },
    props: {
        text: String, // The initial text
    },
    methods: {
        startEditing() {
            this.isEditing = true;
            this.editedText = this.text;
            // Focus the input field after rendering
            this.$nextTick(() => { this.$refs.textInput.focus(); });
        },
        finishEditing() {
            this.isEditing = false;
            // Update the text with the edited value
            this.$emit("update:text", this.editedText);
        },
    },
};
</script>
  