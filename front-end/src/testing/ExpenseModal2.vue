<template>
    <div 
    class="modal fade" 
    v-bind:id="'ModalT'+id" 
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
                        <p>Description:</p>
                        <EditableText2 :initialText="descriptionEdit" @update:initialText="descriptionEdit = $event" />
                        <p>Amount:</p>
                        <EditableText2 :initialText="amountEdit" @update:initialText="amountEdit = $event" />
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import EditableText2 from "./EditableText2.vue";
import { ref, computed } from 'vue';
// import { ref, watch } from 'vue';
  
export default {
    props: {
        id: String,
        initialData: Object,
    },
    setup(props, { emit }) {
    // setup(props) {
        const editedData = ref(props.initialData)
        const descriptionEdit = ref(props.initialData.description)

        const amountEdit = computed({
            get: () => props.initialData.amount,
            set: (newValue) => {
                emit("update:initialData", { ...props.initialData, amount: newValue })
                editedData.value.amount = newValue
            },
        })

        // const amountEdit = ref(props.initialData.amount)

        // watch(
        //     () => [descriptionEdit.value, amountEdit.value],
        //     ([newDescription, newAmount]) => { 
        //         editedData.value.description = newDescription
        //         editedData.value.amount = newAmount
        //     }
        // )

        // const saveData = () => {
        //     emit("updateData", props.id, editedData.value)
        // }

        // watch(() => props.initialData, (newData) => {
        //     amountEdit.value = newData.amount;
        // })

        return {
            editedData,
            descriptionEdit,
            amountEdit,
            // saveData,
        }
    },
    components: {
        EditableText2,
    },
}
</script>
  