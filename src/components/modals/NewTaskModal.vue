<template>
    <div id="modal" class="modal">
        <h3>New Task</h3>
        <form ref="createTaskForm" @submit.prevent="onSubmit()">
            <label for="newTaskName" hidden="hidden">Task Name</label>
            <input id="newTaskName" type="text" placeholder="Task Name" maxlength="30" v-model="taskName" required/>
            <label for="newSubtask" hidden="hidden">Subtask</label>
            <input id="newSubtask" type="text" placeholder="Subtask (optional)" maxlength="30" v-model="subtask" />
            <button type="submit" :disabled="isFormInvalid">Create</button> 
        </form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';

const taskName = ref(null)
const subtask = ref(null)

const isFormInvalid = computed(() => {
        return taskName.value == null
});

async function onSubmit() {
    console.log(`taskName is ${taskName.value.trim()} and subtask is ${subtask.value.trim()}`)
    const res = axios.post('task',
               {"task_name" : taskName.value.trim(), "subtask": subtask.value.trim()})
    return res.data
}
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: auto;
        max-width: 400px;
        width: 35%;
        height: 45%;
        z-index: 999;
        border-color: hsla(160, 100%, 37%, 1);
        border-style: solid;
        border-radius : 5px;
        display : flex;
        flex-direction: column;
        text-align: center;
        padding : 3%;
    }
    
    input {
        width: 50%;
        margin: 2% auto;
        padding: 2%;
        border-radius: 5px;
    }
    
    input:focus {
        border-color: hsla(160, 100%, 37%, 1);
    }

    button {
        width: fit-content;
        padding: 2%;
        border-radius : 5px;
        margin : auto;
    }
</style>