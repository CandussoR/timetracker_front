<template>
    <main id="new-clock">
        <h1>New clock</h1>
    
        <div class="form-container">
            <form @submit.prevent="handleSubmit">
    
                <fieldset id="task__section">
                    <legend>Task
                        <!-- Using click.stop to prevent propagation of closeModal -->
                        <span id="add-task-button" class="material-symbols-outlined" v-if="!newTask" @click.stop="newTask = !newTask">add</span> 
                    </legend>
                   
                    <div class="section-inputs">
                        <TaskSelect :task="selectedTask" @selected="selectedTask = $event"/>
                        <SubtaskSelect v-if="selectedTask" :task="selectedTask" @selected="selectedSubtask = $event" /> 
                    </div>  
                </fieldset>
                
                <fieldset id="tag__section">
                    <legend>Tag
                        <span class="material-symbols-outlined" v-if="!newTag" @click="newTag = !newTag">add</span>
                    </legend>
                    <div class="inline">
                        <TagSelect :tag="selectedTag" @selected="selectedTag = $event"/>
                    </div>
    
                </fieldset>
    
                <fieldset id="clock__section">
                    <legend>Clock Type</legend>
                    <div class="button-row">
                        <button class="button secondary" @click.prevent="clock = 'timer'">Timer</button>
                        <button class="button secondary" @click.prevent="clock = 'chrono'">Stopwatch</button> 
                    </div>
                    <div v-if="clock == 'timer'">
                        <label for="duration">Set your time (in minutes):</label>
                        <input id="duration" name="duration" type="number" min="0" v-model="duration">
                    </div>
                </fieldset>
    
                <button id="set" type="submit" class="button" 
                        :disabled="clock == '' || (clock == 'timer' && duration=='0')">Set</button>
            </form>
         </div>
    
        <ModalFrame content="newTask" v-if="newTask" v-on-click-outside="closeModal"/>
        <ModalFrame content="newTag" v-if="newTag" v-on-click-outside="closeModal"/>
    </main>
</template>

<script setup>
import TaskSelect from '@/components/select/TaskSelect.vue'
import SubtaskSelect from '@/components/select/SubtaskSelect.vue'
import TagSelect from '@/components/select/TagSelect.vue'
import ModalFrame from '@/components/modals/ModalFrame.vue';
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
    #set {
        margin: auto;
    }
</style>