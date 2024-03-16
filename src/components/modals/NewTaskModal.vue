<template>
    <h3>New Task</h3>
    <div if="form-container" class="form-container">
        <form ref="createTaskForm" @submit.prevent="handleSubmit">
            <div class="form-input">
                <label for="newtaskname" hidden="hidden">Task Name</label>
                <input id="newtaskname" type="text" placeholder="Task Name" :maxlength="30" v-model="taskname" required/>
            </div>
            <div class="form-input">
                <label for="newsubtask" hidden="hidden">Subtask</label>
                <input id="newsubtask" type="text" placeholder="Subtask (optional)" :maxlength="30" v-model="subtask" />
            </div>
            <button class="button" type="submit">Create</button> 
            <p v-if="successMsg" class="success">{{ successMsg }}</p>
        </form>
    </div>

</template>

<script setup>
import { useTaskStore } from '@/stores/task';
import { ref } from 'vue';

const taskStore = useTaskStore()
const taskname = ref(null)
const subtask = ref(null)
const successMsg = ref('')

async function handleSubmit() {
    taskStore.isCreated = false
    const res = await taskStore.createTask(taskname.value, subtask.value)
    if (res == 200) {
        successMsg.value = "Task successfully created."
    }

}
</script>

<style scoped>

.success {
    color : #80ED99;
    font-weight: bold;
}
input {
    width: 100%;
}
</style>