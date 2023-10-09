<template>
    <div>
		<h2>Parent Component</h2>
		<table class="table table-hover align-middle">
			<thead>
				<tr>
					<th>Description</th>
					<th>Amount</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(expense, _id) in expensesEdit" :key="_id">
					<td>
						<EditableText2 :initialText="expense.description" @update:initialText="expense.description = $event" />
					</td>
					<td>
						<EditableText2 :initialText="expense.amount" @update:initialText="expense.amount = $event" />
						${{ expense.amount }}
					</td>
					<td>
						<button 
						type="button" 
						class="btn btn-primary" 
						data-bs-toggle="modal" 
						:data-bs-target="'#ModalT'+_id" 
						>
							More
						</button>
						<ExpenseModal2 
						:id="_id"
						:initialData="expense"
						:changedData="changedData"
						/>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
</template>
  
<script>
import { ref } from 'vue'
import { expenses } from './test.js'
import ExpenseModal2 from './ExpenseModal2.vue'
import EditableText2 from './EditableText2.vue'

export default {
	components: {
		ExpenseModal2,
		EditableText2,
	},
	setup() {
		const expensesEdit = ref(expenses) // Define the parent variable using ref

		// Function called from the modal, executed when the data is changed
		const changedData = (id) => {
			console.log("Send a PUT here")
			console.log(expensesEdit.value[id])
		}

		return {
			expensesEdit,
			changedData,
		}
	},
}
</script>
  