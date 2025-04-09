<template>
    <main id="clock" v-if="displayInfo">
        <h1 v-if="!flow">{{displayInfo.title}}</h1>
        <h2 v-if="flow && flow.current.type == 'timer'">Timer {{flow.current.i + 1}} / {{flow.infos.f.length}}</h2>
        <h2 v-else-if="flow">Break</h2>

        <div id="record__info" class="row" v-if="displayInfo && displayInfo.title != 'Break'">
            <p id="record__info-task" class="task" v-if="displayInfo.task_name">{{displayInfo.task_name}}
                <span id="record__info-subtask" v-if="displayInfo.subtask">({{displayInfo.subtask}})</span>
            </p>
            <p id="record__info-tag" class="tag" v-if="displayInfo.tag">{{displayInfo.tag}}</p>
            <button class="icon-clear-gradient" v-if="flow">
                <span class="material-symbols-outlined " @click="handleEdit" title="Edit task & tag">edit</span>
            </button>
        </div>

        <TimerComponent @end="handleUpdateEnd($event)" @launch="handleLaunch" @stopped="isRunning = false"
            :send="sendTimerEnd" :break="displayInfo.title === 'Break'" :key="displayInfo.title" />
        <p id="success" name="success" class="success">{{ success }}</p>

        <Overlay v-if="warnBeforeLeave" />
        <div class="modal" v-if="warnBeforeLeave">
            <div>
                <p v-if="isRunning">A timer is currently running : leaving this page will stop it.</p>
                <p v-else-if="flow">Quitting this page will stop the current flow.</p>
                <div v-if="isRunning" class="button-row">
                    <button v-if="isRunning" class="button" @click="handleQuit('ok')">Ok</button>
                </div>
                <div v-else class="button-row">
                    <button class="button" @click="handleQuit('leave')">Leave</button>
                    <button class="button" @click="handleQuit('cancel')">Cancel</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useTimeRecordStore } from '../stores/timeRecord.js';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import TimerComponent from '@/components/TimerComponent.vue';
import { useStatStore } from '@/stores/stats.js';
import Overlay from '@/components/Overlay.vue';
import { useTaskStore } from '@/stores/task.js';
import { useTagStore } from '@/stores/tag.js';

const timeRecordStore = useTimeRecordStore()
const statStore = useStatStore();
const router = useRouter()
const displayInfo = ref(null)
const isRunning = ref(false)
const hideEdit = ref(false)
const warnBeforeLeave = ref(false)
const receivedEnd = ref(true)
const leaveTo = ref(null)
const sendTimerEnd = ref(false)
const success = ref(null)

let flow = localStorage.getItem('flow')
if (flow) {
    flow = JSON.parse(flow)
}

onMounted(() => {
    let di = localStorage.getItem('displayInfos');
    if (!di) {
        router.push('/new');
    } else {
        displayInfo.value = JSON.parse(di)
    }
})

// Navigation guard
onBeforeRouteLeave((to, from) => {
    // If flow is done, don't warn
    if (flow && !isRunning.value && receivedEnd.value && flow.current.i >= flow.infos.f.length - 1) {
        return true
    }

    // Authorize editing of task & tag in flow : no need to warn.
    if (flow && !isRunning.value && receivedEnd.value && ['/flow', '/flow/edit'].includes(to.path)) {
        return true
    }
    
    // If we are in a middle of a flow and have been warned, we can leave
    else if (warnBeforeLeave.value && !isRunning.value && flow && receivedEnd.value && !['/flow', '/flow/edit'].includes(to.path)) {
        localStorage.clear()
        return true
    }

    // If a flow is sent but has not yet began, can leave, no warning needed
    if (!isRunning.value && receivedEnd.value && (!flow || (flow.current.i == 0 && flow.current.type == 'timer'))) {
        localStorage.clear()
        return true
    }

    // If a flow has begun and use hasn't been warned, we do before leaving
    if (!(warnBeforeLeave.value)
        && (isRunning.value
            || (!isRunning.value
                && receivedEnd.value
                && (flow.current.i != 0 || flow.current.type != 'timer')
            )
        )
    ) {
        leaveTo.value = to.path;
        warnBeforeLeave.value = true;
        return false
    }

    // If a timer is done and we ragequit for any reason without clicking send, still updates the end
    if (!isRunning.value && !receivedEnd.value) {
        sendTimerEnd.value = true
    }

    // If we don't go to the flow page, we clear everything anyway.
    if (to.path != '/flow' || to.path != '/flow/edit') {
        localStorage.clear()
    }
})

function handleEdit() {
    router.push('/flow/edit');
}


function handleLaunch() {
    hideEdit.value = true;
    isRunning.value = true;
    receivedEnd.value = false;
}


async function handleUpdateEnd(tr) {
    isRunning.value = false
    receivedEnd.value = true

    // If no tr, it's the end of a break.
    if (!tr && flow) {
        updateLocalStorage(true)
        return
    } else if (!tr && !flow) {
        localStorage.clear()
        router.push("/new")
        return
    }

    try {
        await timeRecordStore.updateTimeRecord(tr, "ending")
        
        if (!flow) {
            localStorage.removeItem('time_record')
            localStorage.removeItem('duration')
        }
    } catch (e) {
        err.value = e
    }

    statStore.handleUpdated()

    if (flow) {
        updateLocalStorage(true)
    } else if (!sendTimerEnd.value) {
        success.value = "Your timer has been saved. You will now be redirected."
        setTimeout(function() { router.push({ path: '/'})}, 1500)
    }
}


function updateLocalStorage(is_flow) {
    if (!is_flow) {
        localStorage.clear()
        return
    }

    if (flow.current.type == 'break' && flow.current.i == flow.infos.f.length - 1) {
        router.push("/")
        return
    }

    let tr =JSON.parse(localStorage.getItem('time_record'))
    tr.date = null
    tr.guid = null
    if (!("task_guid" in tr && "tag_guid" in tr)) {
        // // Retransform task_name / subtask into task_guid, and tag_name into tag_guid : like in TimerView
        const taskStore = useTaskStore();
        const task_guid = taskStore.tasks.filter((task) => task.task_name == tr["task_name"] && task.subtask == tr["subtask"])
                                        .map((task) => task.guid)[0]
        if (!task_guid) {
            console.error("Couldn't retrieve task_guid from local storage time_record", tr)
            return
        }
        
        let tag_guid = null
        if ("tag" in tr && tr["tag"]) {
            const tagStore = useTagStore()
            tag_guid = tagStore.tags.filter((tag) => tag.tag == tr["tag"])
                                    .map((tag) => tag.guid)[0]
        }
        tr = {
                    "date": null,
                    "task_guid": task_guid,
                    "tag_guid": tag_guid,
                    "time_beginning": null
                }
    }
    localStorage.setItem('time_record', JSON.stringify(tr))

    let wasTimer = flow.current.type == "timer"
    flow.current = { "type": flow.current.type == "timer" ? "break" : "timer", "i": flow.current.type == "break" ? flow.current.i + 1 : flow.current.i }
    localStorage.setItem('flow', JSON.stringify(flow))
    displayInfo.value.title = wasTimer ? "Break" : "Timer"

    localStorage.setItem("duration", flow.infos.f[flow.current.i][wasTimer ? "b" : "t"])

    if (!wasTimer) {
        hideEdit.value = false
    }
}

function handleQuit(answer) {
    if (answer == 'leave') {
        router.push(leaveTo.value)
    } else {
        warnBeforeLeave.value = false
    }
}
</script>

<style scoped>
main {
    display : flex;
    flex-direction : column;
    place-items : center;
}

button {
    border-width: 0;
}

.row {
    display: flex;
    flex-direction: row;
    gap : 1rem;
    place-items: center;
}

.material-symbols-outlined {
    font-size: 1.5rem;
    height: 1.5em;
    width: 1.5em;
}

timer-component {
    margin-top: 0;
}

@media screen and (max-height : 350px) {
    h1, div#record__info {
        display : none;
    }
}

@media screen and (max-height : 400px) {
    h1 {
        display : none;
    }
}
@media screen and (max-height : 500px) {
    div#record__info {
        margin : .3rem auto;
    }
}
</style>