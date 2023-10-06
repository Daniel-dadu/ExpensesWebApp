<template>
    <div 
    class="modal fade" 
    v-bind:id="'Modal'+id" 
    tabindex="-1" 
    aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                        <p>Date:</p>
                        <p>{{ date }}</p>
                        <p>Category:</p>
                        <p>{{ category }}</p>
                        <p>Description:</p>
                        <EditableText :initialText="descriptionEdit" @update:initialText="descriptionEdit = $event" />
                        <p>Amount:</p>
                        <EditableText :initialText="amountEdit" @update:initialText="amountEdit = $event" />
                        <p>Created at:</p>
                        <p>{{ createdAt }}</p>
                        <p>Updated at:</p>
                        <p>{{ updatedAt }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
            descriptionEdit: this.description,
            amountEdit: this.amount,
        }
    },
    props: {
        date: String,
        category: String,
        description: String,
        amount: Number,
        id: Number,
        createdAt: String,
        updatedAt: String,
    },
    components: {
        EditableText,
    },
}
</script>