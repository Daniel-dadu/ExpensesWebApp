<template>
    <div 
    class="modal fade" 
    v-bind:id="'Modal'+props.index" 
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
                            <Datepicker 
                                v-model="initialDate" 
                                @update:model-value="props.onDateSubmit(props.index, initialDate)"
                                :enable-time-picker="false" 
                                :min-date="props.minDate"
                                :max-date="props.maxDate"
                                class="dp__theme_dark" 
                                :dark="true"
                            >
                                <template #trigger>
                                    <button type="button" class="btn btn-dark">
                                        {{initialDate.toDateString()}}
                                    </button>
                                </template>
                            </Datepicker>
                        </div>

                        <p>Category:</p>
                        <div class="modal-editable-elem">
                            <DropdownSelector 
                            :elements="props.categoriesData" 
                            @update:elements="props.updateCategories"
                            :initial-elem="props.initialData.category"
                            @update:initial-elem="props.updateCategorySelected"
                            :index="props.index" 
                            />
                        </div>

                        <p>Description:</p>
                        <div class="modal-editable-elem">
                            <EditableText 
                                :initialText="props.initialData.description"
                                :index="props.index"
                                :input-var="'description'" 
                                @update:initialText="props.updateEditableText"  
                            />
                        </div>
                        
                        <p>Amount:</p>
                        <div class="modal-editable-elem">
                            <div class="expenses-amount-text">
                                <span>$</span>
                                <EditableText 
                                    :initialText="numTwoDecimals(props.initialData.amount)"
                                    :index="props.index"
                                    :input-var="'amount'"
                                    @update:initialText="props.updateEditableText" 
                                />
                            </div>
                        </div>

                        <p>Created at:</p>
                        <div class="modal-editable-elem">
                            {{ new Date(initialData.createdAt).toGMTString() }}
                        </div>

                        <p>Updated at:</p>
                        <div class="modal-editable-elem">
                            {{ new Date(initialData.updatedAt).toGMTString() }}
                        </div>

                </div>
                <div class="modal-footer">
                    <button 
                    type="button" 
                    class="btn btn-outline-danger table-delete-btn"
                    data-bs-dismiss="modal" 
                    @click="removeExpense(props.index)">
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from "vue"
import Datepicker from "@vuepic/vue-datepicker"
import EditableText from "../ReusableComponents/EditableText.vue"
import DropdownSelector from "../ReusableComponents/DropdownSelector.vue"
import { numTwoDecimals } from "../../functions/formatNumbers"

const props = defineProps({
    index: {
        type: [String, Number],
        required: true,
    },
    initialData: Object,
    updateEditableText: Function,
    onDateSubmit: Function,
    categoriesData: Array,
    updateCategories: Function,
    updateCategorySelected: Function,
    removeExpense: Function,
    minDate: Date,
    maxDate: Date,
})

const initialDate = ref(props.initialData.date)
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