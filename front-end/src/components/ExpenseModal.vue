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
                        <p>{{ initialData.date }}</p>
                        <p>Category:</p>
                        <p>{{ initialData.category }}</p>
                        <p>Description:</p>
                        <EditableText :initialText="descriptionEdit" @update:initialText="descriptionEdit = $event" />
                        <p>Amount:</p>
                        <EditableText :initialText="amountEdit" @update:initialText="amountEdit = $event" />
                        <p>Created at:</p>
                        <p>{{ initialData.createdAt }}</p>
                        <p>Updated at:</p>
                        <p>{{ initialData.updatedAt }}</p>
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
import { ref, computed, watch } from "vue";

export default {
    props: {
        id: String,
        initialData: Object,
        changedData: Function,
    },
    setup(props) {
        const editedData = ref(props.initialData)
        
        const descriptionEdit = computed({
            get: () => props.initialData.description,
            set: (newValue) => {
                editedData.value.description = newValue // To update data in the Table
            },
        })

        const amountEdit = computed({
            get: () => props.initialData.amount,
            set: (newValue) => {
                editedData.value.amount = newValue // To update data in the Table
            },
        })

        // Watch for changes in data from this modal and the table
        watch(
            () => [props.initialData.amount, props.initialData.description],
            () => {
                props.changedData(props.id)
            }
        )

        return {
            editedData,
            descriptionEdit,
            amountEdit,
        }
    },
    components: {
        EditableText,
    },
}
</script>