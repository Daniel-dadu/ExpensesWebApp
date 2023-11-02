<template>
    <div class="add-table-elem-div">
        <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="addExpense">
            Add income
        </button>
    </div>
    <table class="table table-hover align-middle my-table">
        <thead>
            <tr>
                <th style="width: 15%;">Date</th>
                <th style="width: 50%;">Source</th>
                <th style="width: 20%;">Amount</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(income, index) in props.incomes" :key="index">
                <td>{{ income.date }}</td>
                <td>{{ income.source }}</td>
                <td>{{ income.amount }}</td>
                <td>
                    <button 
						type="button" 
						class="btn btn-outline-danger table-delete-btn"  
						@click="null"
                    >
                        <img src="@/assets/trash-can.svg" alt="Trash can" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { defineProps, } from "vue"

const props = defineProps({
    incomes: Array,
    currMonthInNum: Number, 
    currYear: Number,
})
</script>