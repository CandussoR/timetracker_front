<template>
    <h3>New Task</h3>
    <form ref="createTaskForm" @submit.prevent="handleSubmit">
        <div>
            <label for="newtaskname" hidden="hidden">task name</label>
            <input class="modalInput" id="newtaskname" type="text" placeholder="Task Name" :maxlength="30" v-model="taskname" required/>
        </div>
        <div>
            <label for="newsubtask" hidden="hidden">subtask</label>
            <input class="modalInput" id="newsubtask" type="text" placeholder="Subtask (optional)" :maxlength="30" v-model="subtask" />
        </div>
        <button class="modalButton" type="submit">Create</button> 
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </form>

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
    if (res) {
        successMsg.value = "Task successfully created."
        taskStore.isCreated = true
    }

}
</script>

<style scoped>
form {
    justify-content: space-evenly;
}

success {
    color : greenyellow;
    font-weight: bold;
}
</style>