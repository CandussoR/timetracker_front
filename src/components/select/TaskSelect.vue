<template>
    <div>
        <label for="taskName" class="sr-only">Task Name : </label>

        <select id="taskNameSelect" name="taskName" v-model="selectedTask" @change="emit('selected', selectedTask)" required>
            <option v-if="!props.task" value="" disabled :selected="props.task ? false : true">Select a task <sup aria-labelledby="Required" title="Required" class="error">*</sup></option>
            <option v-if="props.task" :value="props.task" selected>{{props.task}}</option>
            <option v-for="task in uniqueTasks" :key="task" :value="task">
                {{ task }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
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
const uniqueTasks = computed(() => new Set(taskStore.tasks.filter(x => x.task_name != props.task).map(x => x.task_name)))
</script>

<style scoped></style>