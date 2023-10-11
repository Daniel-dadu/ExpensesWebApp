<template>
    <div 
    class="modal fade" 
    v-bind:id="'Modal'+id" 
    tabindex="-1" 
    aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                        <p>Date:</p>
                        <div class="modal-editable-elem">
                            {{ dateEdit }}
                            <!-- See issue: Make Datepicker from ExpensesModal update the sorting correctly #12 -->
                            <!--                         
                            
                            <Datepicker 
                            v-model="dateEdit" 
                            :enable-time-picker="false" 
                            class="dp__theme_dark" 
                            :dark="true"
                            :format="(date) => `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`" 
                            />
    
                            -->
                        </div>

                        <p>Category:</p>
                        <div class="modal-editable-elem">
                            <DropdownSelector 
                            :elements="categoriesData" 
                            v-model="categoryEdit" 
                            :id="id" 
                            :changedData="changedData" 
                            />
                        </div>

                        <p>Description:</p>
                        <div class="modal-editable-elem">
                            <EditableText 
                            :initialText="descriptionEdit" 
                            @update:initialText="descriptionEdit = $event"  
                            />
                        </div>
                        
                        <p>Amount:</p>
                        <div class="modal-editable-elem">
                            <div class="expenses-amount-text">
                                <span>$</span>
                                <EditableText 
                                :initialText="amountEdit" 
                                @update:initialText="amountEdit = $event" 
                                />
                            </div>
                        </div>

                        <p>Created at:</p>
                        <div class="modal-editable-elem">
                            {{ initialData.createdAt }}
                        </div>

                        <p>Updated at:</p>
                        <div class="modal-editable-elem">
                            {{ initialData.updatedAt }}
                        </div>

                </div>
                <div class="modal-footer">
                    <button 
                    type="button" 
                    class="btn btn-outline-danger delete-expense-btn"
                    data-bs-dismiss="modal" 
                    @click="removeExpense(id)">
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, } from "vue"
// import Datepicker from "@vuepic/vue-datepicker"
import EditableText from "./EditableText.vue"
import DropdownSelector from "./DropdownSelector.vue"

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    },
    initialData: Object,
    changedData: Function,
    categoriesData: Array,
    onChangedDate: Function,
    removeExpense: Function,
})

const editedData = ref(props.initialData)

const dateEdit = computed({
    get: () => props.initialData.date,
    set: (newValue) => {
        editedData.value.date = newValue // To update data in the Table
    }
})

const categoryEdit = computed({
    get: () => props.initialData.category,
    set: (newValue) => {
        editedData.value.category = newValue
    }
})

const descriptionEdit = computed({
    get: () => props.initialData.description,
    set: (newValue) => {
        editedData.value.description = newValue // To update data in the Table
    }
})

const amountEdit = computed({
    get: () => props.initialData.amount,
    set: (newValue) => {
        editedData.value.amount = newValue // To update data in the Table
    }
})

// Watch for changes in data from this modal and the table
watch(
    () => [
        props.initialData.date,
        props.initialData.description,
        props.initialData.amount,
    ],
    () => {
        props.changedData(props.id)
    }
)

watch(
    () => props.categoriesData,
    () => {
        console.log("Changed Categories Array")
    }
)

// Watch for changes in Date
watch(
    () => props.initialData.date,
    () => {
        props.onChangedDate()
    }
)
</script>


<style>
.modal-body p {
    font-weight: bold;
    margin-bottom: .5em;
}
.modal-editable-elem {
    margin-bottom: 1.5em;
}
</style>