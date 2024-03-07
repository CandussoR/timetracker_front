<template>
    <div>
        <label for="subtask">Subtask name (optional) : </label>

        <select id="subtask-select" name="substask" v-model="selectedSubtask" @change="emit('selected', selectedSubtask)">
            <option v-if="task" value="" disabled selected>Select a subtask (optional)</option>
            <option v-for="subtask in taskStore.filterSubtask(task)" :key="subtask" :value="subtask">
                {{ subtask }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/task.js'
import { ref, watch } from 'vue';
const taskStore = useTaskStore();
// Gets the task selected to update the dropdown
const props = defineProps(["task", "subtask"]);
// Returns the selected Subtask to the parent
const emit = defineEmits(["selected"]);
const selectedSubtask = ref(props.subtask ?? "");

// Watches for the change of value on creation,
// which precedes the closing of the modal in the parent
// and updates the value in the dropdown and sends it to the parent
watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            selectedSubtask.value = taskStore.createdSubtask
    }
});
</script>

<style scoped>

</style>