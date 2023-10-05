<template>
    <div 
    class="modal fade" 
    id="exampleModal" 
    tabindex="-1" 
    aria-labelledby="exampleModalLabel" 
    aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                    <p>Some text:</p>
                    <EditableText :text="content" @update:text="content = $event" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import EditableText from "./EditableText.vue";

export default {
    name: "ExpenseModal",
    data() {
        return {
            content: "Initial Text",
        }
    },
    props: {
        text: String, // The initial text
    },
    components: {
        EditableText,
    },
}
</script>