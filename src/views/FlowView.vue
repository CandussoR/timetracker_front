<template>
    <main v-if="flow">
        <h1>{{flow.infos.n}}</h1>
        <!-- Compteur de timer actuel -->
        <h2>Timer {{flow.current.i + 1}} / {{flow.infos.f.length}}</h2>
        <!-- Affichage de la tâche et du tag avec possibilité d'éditer -->
        <div v-if="false"></div>
        <div class="form-container" v-else>
            <form @submit.prevent="handleSubmit">

                <fieldset id="task__section">
                    <legend>Task
                        <!-- Using click.stop to prevent propagation of closeModal -->
                        <span id="add-task-button" class="material-symbols-outlined" v-if="!newTask"
                            @click.stop="newTask = !newTask">add</span>
                    </legend>

                    <div class="section-inputs">
                        <TaskSelect :task="selectedTask" @selected="selectedTask = $event" :key="selectedTask" />
                        <SubtaskSelect v-if="selectedTask" :task="selectedTask" view="timerForm"
                            @selected="selectedSubtask = $event" />
                    </div>
                    <p class="error" v-if="error">Couldn't retrieve the task : be sure to select a subtask.</p>
                </fieldset>

                <fieldset id="tag__section">
                    <legend>Tag
                        <span class="material-symbols-outlined" v-if="!newTag" @click="newTag = !newTag">add</span>
                    </legend>
                    <div class="inline">
                        <TagSelect :tag="selectedTag" @selected="selectedTag = $event" :key="selectedTag" />
                    </div>

                </fieldset>
                <p class="error" v-if="storageError">Couldn't retrieve any record in storage, redirecting to timer
                    selection.</p>
                <button id="set" type="submit" class="button" :disabled="!selectedTask">Set</button>
            </form>
        </div>

        <Overlay v-if="newTask || newTag || warnBeforeLeave" @click="closeModal" />
        <ModalFrame content="newTask" v-if="newTask" />
        <ModalFrame content="newTag" v-if="newTag" />
        <div class="modal" v-if="warnBeforeLeave">
            <div>
                <p>Quitting this page will stop the current flow.</p>
                <div class="button-row">
                    <button class="button" @click="handleQuit('quit')">Quit</button>
                    <button class="button" @click="handleQuit('stay')">Stay</button>
                </div>
            </div>
        </div>
        <update-last-timer-button v-if="flow.current.i > 0" />
    </main>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import Overlay from '@/components/Overlay.vue';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import UpdateLastTimerButton from '@/components/UpdateLastTimerButton.vue';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';

let flow = localStorage.getItem('flow')
if (flow) {
    flow = JSON.parse(flow)
}
const router = useRouter();
const route = useRoute();

const taskStore = useTaskStore();
const tagStore = useTagStore();

const error = ref(false);
const storageError = ref(false);

const selectedTask = ref(null);
const selectedSubtask = ref(null);
const selectedTag = ref(null);
const newTask = ref(false);
const newTag = ref(false);

const warnBeforeLeave = ref(false);
const leaveTo = ref(null)

onMounted(() => {
    if (route.path === '/flow/edit') {
        loadData();
    }
    if (!flow) {
        router.push('/new')
    }
    if (!(taskStore.tasks)) {
        taskStore.index();
    }
    if (!(tagStore.tags)) {
        tagStore.index();
    }
})


// Navigation guard
onBeforeRouteLeave((to, from) => {
    if (flow && flow.current.i == 0 && flow.current.type == 'timer') {
        if (to.path != '/ongoing') {
            localStorage.clear()
        }
        return true
    }

    if (flow 
        && (from.path == "/flow" || from.path == '/flow/edit') 
        && (to.path != '/ongoing') 
        && !(warnBeforeLeave.value)
    ) {
        leaveTo.value = to.path;
        warnBeforeLeave.value = true;
        return false
    }
})


function closeModal() {
    newTask.value = false;
    newTag.value = false;
}


function loadData() {
    try {
        let tr = JSON.parse(localStorage.getItem('time_record'));
        // After the first timer of a flow
        if ('task_name' in tr && 'subtask' in tr) {
            selectedTask.value = tr.task_name
            selectedSubtask.value = tr.subtask
            selectedTag.value = tr.tag
            return
        }

        //Before the first timer
        let task = taskStore.tasks.filter(x => x.guid == tr.task_guid)[0]
        selectedTask.value = task.task_name
        selectedSubtask.value = task.subtask
        let tag = tagStore.tags.filter(x => x.guid == tr.tag_guid)[0]
        if (tag) {
            selectedTag.value = tag.tag
        }
    } catch(e) {
        storageError.value = true
        localStorage.clear()
        router.push('/new')
    }
}


function handleSubmit() {
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

    localStorage.setItem('displayInfos', JSON.stringify(
        { "title": "Flow", "task_name": selectedTask.value, "subtask": selectedSubtask.value, "tag": selectedTag.value })
    )

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
    let flow = JSON.parse(localStorage.getItem('flow'))
    localStorage.setItem('duration', flow.infos.f[flow.current.i][flow.current.type == 'timer' ? "t" : "b"])

    router.push({ path : '/ongoing'})
}

function handleQuit(answer) {
    if (answer === 'quit') {
        router.push(leaveTo.value)
    } else {
        warnBeforeLeave.value = false;
        leaveTo.value = null;
    }
}
</script>

<style scoped>

</style>