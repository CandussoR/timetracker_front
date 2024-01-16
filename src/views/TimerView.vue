<template>
    <div>
        <h1>Let's set a new timer and do something !</h1>

        <div>
            <h2>Choose a task</h2>

            <h3>Task</h3>
            <select id="taskNameSelect" name="taskName" v-model="selectedTask" required>
                <option v-for="task in taskStore.uniqueTasks" :key="task" :value="task">
                    {{ task }}
                </option>
            </select>
           

            <h3>Subtask</h3>
            <select id="subtaskSelect" name="substask" v-model="selectedSubtask">
                <option v-for="subtask in taskStore.filterSubtask(selectedTask)" :key="subtask" :value="subtask">
                    {{ subtask }}
                </option>
            </select>

            <button v-if="!newTask" @click="newTask = !newTask">New task</button>
            <div v-else>
                <h3>New Task</h3>
                <input type="text" placeholder="Task Name" v-model="taskName"/>
                <input type="text" placeholder="Subtask (optional)" v-model="subtask" />
                <button @click="createTask(taskName, subtask)">Create</button>
            </div>
        </div>

        <div>
        <h2>Choose a tag</h2>
        <input id="tagInput" name="tagInput" list="tagData" v-model="selectedTag"/>
        <datalist id="tagData">
            <option v-for="tag in tagStore.tags" :key="tag.tag">
                {{ tag.tag }}
            </option> 
        </datalist>

        <button v-if="!newTag" @click="newTag = !newTag">New Tag</button>
            <div v-else>
                <h3>New Tag</h3>
                <input type="text" placeholder="tag" v-model="tag"/>
                <button @click="createTag(tag)">Create</button>
                <button @click="newTag = !newTag">Forget it</button>
            </div>
        </div>

        <div>
            <button @click="timer = true">Let's do a timer</button>
            <div v-if="timer">
                <h2>Set your time</h2>
                <input id="duration" name="duration" type="number" min="0" v-model="duration">
            </div>
            <button>How about we do a chrono instead ?</button> 
        </div>
    </div>
</template>

<script setup>
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
const taskName = ref('')
const subtask = ref(null)
const timer = ref(false)
const duration = ref(0)

function createTask(taskName, subtask) {
    console.log("Yeah whatever")
    console.log(`taskName is ${taskName} and subtask is ${subtask}`)
    newTask.value = !newTask.value
}

function createTag(tag) {
    console.log(`The tag is obviously ${tag} duh`)
    newTag.value = !newTag.value
}

</script>

<style scoped>

</style>