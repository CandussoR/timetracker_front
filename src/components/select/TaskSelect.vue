<template>
    <label for="taskName">Task Name : </label>
    <select id="taskNameSelect" name="taskName" v-model="selectedTask" @change="emit('selected', selectedTask)" required>
        <option value="" disabled selected>Select a task</option>
        <option v-for="task in taskStore.uniqueTasks" :key="task" :value="task">
            {{ task }}
        </option>
    </select>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTaskStore } from '../../stores/task.js'
const taskStore = useTaskStore()
taskStore.index()
const props = defineProps(["task"])
const emit = defineEmits(["selected"])
const selectedTask = ref(props.task ?? '')
watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            selectedTask.value = taskStore.createdTask
    }
});
</script>

<style scoped>
    #taskNameSelect {
        display: flex;
    }
</style>