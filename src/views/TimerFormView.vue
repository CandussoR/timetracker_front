<template>
    <h1>Let's set a new timer and do something !</h1>

    <div class="form-container">
        <form @submit.prevent="handleSubmit">

            <fieldset id="task__section">
                <legend>Task</legend>
               
                <div class="inline">
                    <div class="column">
                        <label for="taskNameSelect">Task</label>
                        <TaskSelect :task="selectedTask" @selected="selectedTask = $event"/>

                        <label for="subtaskSelect">Subtask</label>
                        <SubtaskSelect :task="selectedTask" @selected="selectedSubtask = $event" /> 
                    </div>
                    <!-- Using click.stop to prevent propagation of closeModal -->
                    <span id="add-task-button" class="material-symbols-outlined" v-if="!newTask" @click.stop="newTask = !newTask">add</span> 
                </div>
                
               
            </fieldset>
            
            <fieldset id="tag__section">
                <legend>Tag</legend>
                <label for="tagInput" hidden="hidden">Tag</label>
                <div class="inline">
                    <TagSelect :tag="selectedTag" @selected="selectedTag = $event"/>
                    <span class="material-symbols-outlined" v-if="!newTag" @click="newTag = !newTag">add</span>
                </div>

            </fieldset>

            <fieldset id="clock__section">
                <legend>Clock Type</legend>
                <div>
                    <button @click.prevent="clock = 'timer'">Timer</button>
                    <button @click.prevent="clock = 'chrono'">Stopwatch</button> 
                </div>
                <div v-if="clock == 'timer'">
                    <h2>Set your time</h2>
                    <input id="duration" name="duration" type="number" min="0" v-model="duration">
                </div>
            </fieldset>

            <button type="submit" 
                    :disabled="clock == '' || (clock == 'timer' && duration=='0')">Set</button>
        </form>
     </div>

    <Modal content="newTask" v-if="newTask" v-on-click-outside="closeModal"/>
    <Modal content="newTag" v-if="newTag" v-on-click-outside="closeModal"/>
</template>

<script setup>
import TaskSelect from '@/components/select/TaskSelect.vue'
import SubtaskSelect from '@/components/select/SubtaskSelect.vue'
import TagSelect from '@/components/select/TagSelect.vue'
import Modal from '@/components/modals/Modal.vue';
import { vOnClickOutside } from '@vueuse/components'
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const taskStore = useTaskStore()
const tagStore = useTagStore()
const router = useRouter()

const newTask = ref(false)
const newTag = ref(false)
const selectedTask = ref(null)
const selectedSubtask = ref(null)
const selectedTag = ref(null)
const clock = ref('')
const duration = ref(0)

function closeModal() {
    newTask.value = false;
    newTag.value = false;
}

watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
    }
});

watch(
    () => tagStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
    }
});

function handleSubmit() {
    const task_guid = taskStore.tasks.filter((task) => task.task_name == selectedTask.value && task.subtask == selectedSubtask.value)
                                     .map((task) => task.guid)[0]
    
    let tag_guid = null
    if (selectedTag.value) {
        tag_guid = tagStore.tags.filter((tag) => tag.tag == selectedTag.value)
                                .map((tag) => tag.guid)[0]
    }

    sessionStorage.setItem('time_record',
        JSON.stringify(
            {
                "date": null,
                "task_guid": task_guid,
                "tag_guid": tag_guid,
                "time_beginning": null
            }
        )
    )

    // Converts duration into seconds if there is one.
    if (duration.value) sessionStorage.setItem('duration', duration.value * 60)

    router.push({ path : '/ongoing'})
}

</script>

<style scoped>
    .template {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .form_container {
        display:block;
        width: 75%;
    }

    .form {
        justify-content: center;
    }

    .inline {
        display: flex;
    }

    .column {
        display: flex;
        flex-direction: column;
    }

    #add-task-button {
        margin: auto 0;
    }
</style>