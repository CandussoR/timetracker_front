<template>
    <main id="new-clock">
        <h1>New clock</h1>

        <div class="individual-or-flow">
            <div class="box" :class="[{'selected': type == 'ind'}]" @click="type = 'ind'">
                <h3>Individual</h3>
            </div>
            <div class="separator"></div>
            <div class="box" :class="[{'selected': type == 'flow'}]" @click="type = 'flow'">
                <h3>Flow</h3>
            </div>
            <div class="separator"></div>
            <div class="box" :class="[{'selected': type == 'break'}]" @click="type = 'break'">
                <h3>Break</h3>
            </div>
        </div>

        <div class="form-container" v-if="flow">
            <form @submit.prevent="handleFlow">
                <fieldset id="task__section">
                    <legend>Flow
                        <!-- Using click.stop to prevent propagation of closeModal -->
                    </legend>
                    <div class="flow-section-input">
                        <FlowSelect :inventory="flowStore.inventory.map(f => f.n)" 
                            :flow="selectedFlow !== null ? flowStore.inventory[selectedFlow].n : null" 
                            @change="selectedFlow = Number($event.target.value)" 
                            :key="selectedFlow" />
                    </div>
                </fieldset>
                <button class="button" type="submit" value="Next" :disabled="selectedFlow === null">Next</button>
            </form>
        </div>


        <div class="form-container" v-else>
            <form @submit.prevent="handleSubmit">

                <fieldset id="task__section" v-if="type !== 'break'">
                    <legend>Task
                        <!-- Using click.stop to prevent propagation of closeModal -->
                        <span id="add-task-button" class="material-symbols-outlined" v-if="!newTask"
                            @click.stop="newTask = !newTask">add</span>
                    </legend>

                    <div class="section-inputs">
                        <TaskSelect :task="selectedTask" @selected="selectedTask = $event" />
                        <SubtaskSelect v-if="selectedTask" :task="selectedTask" view="timerForm"
                            @selected="selectedSubtask = $event" />
                    </div>
                    <p class="error" v-if="error">Couldn't retrieve the task : be sure to select a subtask.</p>
                </fieldset>

                <fieldset id="tag__section" v-if="type !== 'break'">
                    <legend>Tag
                        <span class="material-symbols-outlined" v-if="!newTag" @click="newTag = !newTag">add</span>
                    </legend>
                    <div class="inline">
                        <TagSelect :tag="selectedTag" @selected="selectedTag = $event" :key="selectedTag" />
                    </div>

                </fieldset>

                <fieldset id="clock__section">
                    <legend v-if="type !== 'break'">Clock Type</legend>
                    <div class="button-row" v-if="type !== 'break'">
                        <button class="button" :class="[clock == 'Timer' ? 'active bigger' : 'primary']"
                            @click.prevent="clock = 'Timer'">Timer</button>
                        <button class="button" :class="[clock == 'Stopwatch' ? 'active bigger' : 'primary']"
                            @click.prevent="clock = 'Stopwatch'">Stopwatch</button>
                    </div>
                    <div v-if="clock == 'Timer' || type === 'break'">
                        <label for="duration">Set your time (in minutes):</label>
                        <input id="duration" name="duration" type="number" min="0" v-model="duration">
                    </div>
                </fieldset>

                <button id="set" type="submit" class="button"
                    :disabled="type === 'break' ? false : (clock == '' || (clock == 'Timer' && duration=='0'))">Set</button>
            </form>
        </div>

        <Overlay v-if="newTask || newTag" @click="closeModal" />
        <ModalFrame content="newTask" v-if="newTask" />
        <ModalFrame content="newTag" v-if="newTag" />
    </main>
</template>

<script setup>
import FlowSelect from '@/components/select/FlowSelect.vue';
import TaskSelect from '@/components/select/TaskSelect.vue'
import SubtaskSelect from '@/components/select/SubtaskSelect.vue'
import TagSelect from '@/components/select/TagSelect.vue'
import ModalFrame from '@/components/modals/ModalFrame.vue';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Overlay from '@/components/Overlay.vue';
import { useFlowStore } from '@/stores/flow';

const taskStore = useTaskStore()
const tagStore = useTagStore()
const flowStore = useFlowStore()
const router = useRouter()

const type = ref('ind')

const newTask = ref(false)
const newTag = ref(false)
const selectedTask = ref(null)
const selectedSubtask = ref(null)
const selectedTag = ref(null)
const clock = ref('')
const duration = ref(0)
const flow = computed(() => type.value == 'flow')
const selectedFlow = ref(null)
const error = ref(false)

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
    selectedTask.value = taskStore.createdTask;
    selectedSubtask.value = taskStore.createdSubtask;
});

watch(
    () => tagStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
   }
   selectedTag.value = tagStore.createdTag;
});

function handleSubmit() {
    if (type.value === 'break') {
        localStorage.setItem('displayInfos', JSON.stringify({"title": "Break"}))
        localStorage.setItem('duration', duration.value * 60)
        router.push({ path : '/ongoing'})
        return
    }

    const task_guid = taskStore.tasks.filter((task) => task.task_name == selectedTask.value && task.subtask == selectedSubtask.value)
                                     .map((task) => task.guid)[0]
    if (!task_guid) {
        error.value = true
        return
    }
    
    let tag_guid = null
    if (selectedTag.value) {
        tag_guid = tagStore.tags.filter((tag) => tag.tag == selectedTag.value)
                                .map((tag) => tag.guid)[0]
    }

    localStorage.setItem('displayInfos', JSON.stringify({"title": clock.value, "task_name" : selectedTask.value, "subtask" : selectedSubtask.value, "tag" : selectedTag.value}))
    localStorage.setItem('time_record',
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
    if (duration.value) localStorage.setItem('duration', duration.value * 60)

    router.push({ path : '/ongoing'})
}


function handleFlow() {
    localStorage.setItem('flow',
        JSON.stringify({"infos": flowStore.inventory[selectedFlow.value],
        "current": {"type" : "timer", "i": 0}
    })
)

    router.push('/flow')
}

</script>

<style scoped>
    #set {
        margin: auto;
    }
    .overlay {
    position: fixed;
    top: 0;
    left : 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(1px);
    z-index: 98;
}
.active {
    color: var(--text);
    background: var(--secondary);
}
.bigger {
    scale: 1.3;
}

.individual-or-flow {
    display: grid;
    width: fit-content;
    grid-template-columns: .9fr .2fr .9fr .2fr .9fr;
    place-items: center; 
    margin-left: auto;
    margin-right: auto;
}

.separator {
        width: 1px;
        height: 50%;
        margin: 0 .5rem;
        background-color: #FFFFFFFF;
    }

.h2 {
    font-size: 1.5em;
}
.box {
    width: max-content;
    border-radius: 5px;
    padding: 0 .5em;
}

.box:hover {
    cursor: pointer;
}
.box:hover, .selected {
    border: 1px solid var(--accent);
    color: var(--accent);
}
</style>