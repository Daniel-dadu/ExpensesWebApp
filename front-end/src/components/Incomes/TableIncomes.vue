<template>
    <div class="add-table-elem-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addIncome">
            Add income
        </button>
    </div>
    <table class="table table-hover align-middle my-table">
        <thead>
            <tr>
                <th style="width: 15%;">Date</th>
                <th style="width: 55%;">Source</th>
                <th style="width: 15%;">Amount</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(income, index) in props.incomes" :key="index">
                <td>
                    <Datepicker 
						v-model="income.date" 
                        @update:model-value="onDateSubmit(index)"
						:enable-time-picker="false" 
                        :min-date="new Date(2023, props.currMonthInNum, 1)"
                        :max-date="new Date(2023, props.currMonthInNum+1, 0)"
						class="dp__theme_dark" 
						:dark="true"
                    >
						<template #trigger>
							<button type="button" class="btn btn-dark">
								{{income.date.toDateString()}}
							</button>
						</template>
					</Datepicker>
                </td>
                <td>
                    <EditableText 
						:initialText="income.source" 
						:index="index"
						:input-var="'source'" 
						@update:initial-text="updateEditableText"
                    />
                </td>
                <td>
                    <div class="div-amount-text">
                        <span>$</span>
                        <EditableText 
							:initial-text="numTwoDecimals(income.amount)" 
							:index="index"
							:input-var="'amount'" 
							@update:initial-text="updateEditableText"
                        />
                    </div>
                </td>
                <td>
                    <button 
						type="button" 
						class="btn btn-outline-danger table-delete-btn"  
						@click="removeIncome(index)"
                    >
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { defineProps, defineEmits, } from "vue"
import EditableText from "../ReusableComponents/EditableText.vue"
import Datepicker from "@vuepic/vue-datepicker"
import { numTwoDecimals } from "../../functions/formatNumbers"

const props = defineProps({
    incomes: Array,
    currMonthInNum: Number, 
    currYear: Number,
})

const emit = defineEmits(["update:incomes"])

const addIncome = () => {
    const validDate = () => {
        const d = new Date(
            props.currYear, 
            props.currMonthInNum, 
            new Date().getDate() // Today's day
        )
        
        return d.getMonth() == props.currMonthInNum ? d :
            new Date(props.currYear, props.currMonthInNum + 1, 0)
    }

    let newIncome = { 
        "userId": window.localStorage.getItem("email"),
        "date": validDate(),
        "source": "Add a source",
        "amount": 0.0,
    }
    emit("update:incomes", "add", newIncome)
}

const updateEditableText = (newVal, idx, inputVar) => {
    console.log(newVal, idx, inputVar)
    if(inputVar === "amount") { newVal = parseFloat(newVal) }
    emit("update:incomes", "update", newVal, idx, inputVar)
}

const removeIncome = (idx) => {
    emit("update:incomes", "remove", null, idx)
}

// When date is changed manually
const onDateSubmit = (idx) => {
    console.log(idx)
    emit("update:incomes", "update", props.incomes[idx].date, idx, "date")
    emit("update:incomes", "sort")
}
</script>