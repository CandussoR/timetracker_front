<template>
    <div>
        <label for="taskName">Task Name : </label>

        <select id="taskNameSelect" name="taskName" v-model="selectedTask" @change="emit('selected', selectedTask)" required>
            <option v-if="props.task" :value="props.task" selected>{{props.task}}</option>
            <option v-else value="" disabled selected>Select a task</option>
            <option v-for="task in taskStore.uniqueTasks" :key="task" :value="task">
                {{ task }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTaskStore } from '../../stores/task.js'
const taskStore = useTaskStore()
taskStore.index()
const props = defineProps(["task"])
const emit = defineEmits(["selected"])
const selectedTask = ref(props.task ? props.task : '')

watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            selectedTask.value = taskStore.createdTask
    }
});
</script>

<style scoped>

</style>