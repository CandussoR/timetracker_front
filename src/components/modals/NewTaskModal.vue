<template>
    <h3>New Task</h3>
    <div if="form-container" class="form-container">
        <form ref="createTaskForm" @submit.prevent="handleSubmit">
            <Info v-if="displayInfo" msg="Task or subtask must not contain any space." />
            <div class="form-input">
                <label for="newtaskname" hidden="hidden">Task Name 
                    <sup aria-labelledby="Required" title="Required" class="error">*</sup>
                </label>
                <input id="newtaskname" type="text" placeholder="Task Name" :maxlength="30" v-model="taskname" required/>
            </div>
            <div class="form-input">
                <label for="newsubtask" hidden="hidden">Subtask</label>
                <input id="newsubtask" type="text" placeholder="Subtask (optional)" :maxlength="30" v-model="subtask" />
            </div>
            <p v-if="successMsg" class="success">{{ successMsg }}</p>
            <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>
            <button class="button" type="submit">Create</button> 
        </form>
    </div>

</template>

<script setup>
import Info from "@/components/Info.vue";
import { useTaskStore } from '@/stores/task';
import { ref } from 'vue';

const taskStore = useTaskStore()
const taskname = ref(null)
const subtask = ref(null)
const successMsg = ref(null)
const errorMsg = ref(null)
const displayInfo = ref(false)

async function handleSubmit() {
    displayInfo.value = false
    if (taskname.value && taskname.value.includes(' ') || subtask.value && subtask.value.includes(' ')) {
        displayInfo.value = true;
        return
    }
    taskStore.isCreated = false
    const res = await taskStore.createTask(taskname.value, subtask.value)
    if (res.status == 200) {
        successMsg.value = "Task successfully created !"
    } else if (res.status == 422) {
        errorMsg.value = res.data
    } else {
        errorMsg.value = "An error occured."
    }
}
</script>

<style scoped>
input {
    width: 100%;
}
</style>