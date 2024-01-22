<template>
    <h1>Let's set a new timer and do something !</h1>

    <div class="form-container">
        <form>

            <fieldset id="task__section">
                <legend>Task</legend>

                <label for="taskNameSelect">Task</label>
                <select id="taskNameSelect" name="taskName" v-model="selectedTask" @change="newTask = !newTask" required>
                    <option v-for="task in taskStore.uniqueTasks" :key="task" :value="task">
                        {{ task }}
                    </option>
                </select>

                <label for="subtaskSelect">Subtask</label>
                <select id="subtaskSelect" name="substask" v-model="selectedSubtask">
                    <option v-for="subtask in taskStore.filterSubtask(selectedTask)" :key="subtask" :value="subtask">
                        {{ subtask }}
                    </option>
                </select>

                <!-- Using click.stop to prevent propagation of closeModal -->
                <span class="material-symbols-outlined" v-if="!newTask" @click.stop="newTask = !newTask">add</span> 
            </fieldset>
            
            <fieldset id="tag__section">
                <legend>Tag</legend>
                <label for="tagInput" hidden="hidden">Tag</label>
                <input id="tagInput" name="tagInput" list="tagData" v-model="selectedTag"/>
                <datalist id="tagData">
                    <option v-for="tag in tagStore.tags" :key="tag.tag">
                        {{ tag.tag }}
                    </option> 
                </datalist>

                <span class="material-symbols-outlined" v-if="!newTag" @click="newTag = !newTag">add</span>
            </fieldset>

            <fieldset id="clock__section">
                <legend>Clock Type</legend>
                <button @click="clock = 'timer'">Timer</button>
                <div v-if="clock == 'timer'">
                    <h2>Set your time</h2>
                    <input id="duration" name="duration" type="number" min="0" v-model="duration">
                </div>
                <button @click="clock = 'chrono'">Stopwatch</button> 
            </fieldset>

            <button :disabled="clock == ''" @click="launch(clock)">Launch !</button>
        </form>
    </div>

    <Modal content="newTask" v-if="newTask" v-on-click-outside="closeModal"/>
    <Modal content="newTag" v-if="newTag" v-on-click-outside="closeModal"/>
</template>

<script setup>
import { vOnClickOutside } from '@vueuse/components'
import Modal from '@/components/modals/Modal.vue';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { ref, watch } from 'vue';

const taskStore = useTaskStore()
taskStore.index()
const tagStore = useTagStore()
tagStore.index()

const newTask = ref(false)
const newTag = ref(false)
const selectedTask = ref(null)
const selectedSubtask = ref(null)
const selectedTag = ref(null)
const clock = ref('')
const duration = ref(0)


function launch(clock) {
    console.log(`launching a ${clock}, but how do you want to do it ?`)
}

function closeModal() {
    console.log("closing modals")
    newTask.value = false;
    newTag.value = false;
}

watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
            selectedTask.value = taskStore.createdTask
            selectedSubtask.value = taskStore.createdSubtask
    }
});

watch(
    () => tagStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
            selectedTag.value = tagStore.createdTag
    }
});

</script>

<style scoped>
    .template {
        display: flex;
        flex-direction: column;
    }
    .form_container {
        display:block;
    }
</style>