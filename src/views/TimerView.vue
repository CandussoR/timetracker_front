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

                <span class="material-symbols-outlined" v-if="!newTask" @click="newTask = !newTask">add</span> 
                <!-- <div v-else>
                    <h3>New Task</h3>
                    <input type="text" placeholder="Task Name" v-model="taskName"/>
                    <input type="text" placeholder="Subtask (optional)" v-model="subtask" />
                    <button @click="createTask(taskName, subtask)">Create</button>
                </div> -->
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
                <div v-else>
                    <h3>New Tag</h3>
                    <input type="text" placeholder="tag" v-model="tag"/>
                    <button @click="createTag(tag)">Create</button>
                    <button @click="newTag = !newTag">Forget it</button>
                </div>
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

    <NewTaskModal v-if="newTask"/>
</template>

<script setup>
import NewTaskModal from '@/components/modals/NewTaskModal.vue';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { ref } from 'vue';

const taskStore = useTaskStore()
taskStore.index()
const tagStore = useTagStore()
tagStore.index()

const newTask = ref(false)
const newTag = ref(false)
const selectedTask = ref(null)
const selectedSubtask = ref(null)
const selectedTag = ref(null)
const tag = ref(null)
const clock = ref('')
const duration = ref(0)


function createTag(tag) {
    console.log(`The tag is obviously ${tag} duh`)
    newTag.value = !newTag.value
}

function launch(clock) {
    console.log(`launching a ${clock}, but how do you want to do it ?`)
}

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