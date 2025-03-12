<template>
    <div v-if="props.task && subtaskCanBeNull">
        <label v-if="subtaskCanBeNull" for="subtask">Subtask name (optional) : </label>
        <select id="subtask-select" name="substask" v-model="selectedSubtask" @change="emit('selected', selectedSubtask)">
            <option v-if="props.view == 'timerForm'" value="" default>No subtask</option>
            <option v-else value="" default>All subtasks</option>
            <option v-if="props.view != 'timerForm'" value="None">No subtask</option>
            <option v-for="subtask in subtasks.filter(st => st !== null)" :key="subtask" :value="subtask">
                {{ subtask }}
            </option>
        </select>
    </div>

    <div v-else-if="props.task">
        <label for="subtask">Subtask name : </label>
        <select id="subtask-select" name="substask" v-model="selectedSubtask" @change="emit('selected', selectedSubtask)">
            <option value="" disabled>Select a subtask</option>
            <option v-for="subtask in subtasks" :key="subtask" :value="subtask">
                {{ subtask }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/task.js'
import { ref, watch, computed, onMounted } from 'vue';
const taskStore = useTaskStore();
// Gets the task selected to update the dropdown
const props = defineProps(["task", "subtask", "view"]);
// Returns the selected Subtask to the parent
const emit = defineEmits(["selected"]);

const subtasks = ref([]);

const subtaskCanBeNull = computed(() => subtasks.value.includes(null));
// Initiated with subtask prop if any, modified with input
const selectedSubtask = ref(null);


// Same thing on mounted and on change of prop.
onMounted(() => getSubtasksAndSelect(props.task))
watch(
    () => props.task,
    () => getSubtasksAndSelect(props.task)
)


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

/**
 * Is used by hooks for setting up the select input.
 * @param {string} task_name
 *
 */
function getSubtasksAndSelect(task_name) {
    subtasks.value = filterSubtask(props.task)
    selectedSubtask.value = getSelectedSubtaskValue()
    if (selectedSubtask.value) {
        emit('selected', selectedSubtask.value)
    }
}

/**
 * Returns an array of the possible subtasks associated to this task name
 * 
 * @param {string} task_name 
 * @returns {Array<String>}
 */
    function filterSubtask(task_name) {
        return taskStore.tasks.filter((task) => (task.task_name == task_name)).map(t => t.subtask)

}


/**
 * Returns a computed value for selected subtask when props.task changes.
 * Is otherwise changed via v-model.
 * 
 * @returns {String}
 */
function getSelectedSubtaskValue() {
    if (props.subtask) return props.subtask;
    if (subtaskCanBeNull.value) return "";
    if (subtasks.value) return subtasks.value[0];
}

</script>

<style scoped>

</style>