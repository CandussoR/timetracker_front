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
            <button class="icon-clear-gradient">
                <span class="material-symbols-outlined " @click="handleEdit" title="Edit task & tag">edit</span>
            </button>
        </div>

        <TimerComponent @end="handleUpdateEnd($event)" @launch="handleLaunch" @stopped="isRunning = false"
            :send="sendTimerEnd" :break="displayInfo.title === 'Break'" :key="displayInfo.title" />
        <p id="success" name="success" class="success">{{ success }}</p>

        <Overlay v-if="warnBeforeLeave" />
        <div class="modal" v-if="warnBeforeLeave">
            <div>
                <p v-if="isRunning">A timer is currently running : stop it before you leave.</p>
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
    // Authorize editing of task & tag in flow
    if (!isRunning.value && flow && receivedEnd.value && ['/flow', '/flow/edit'].includes(to.path)) {
        return true
    } else if (!isRunning.value && flow && receivedEnd.value && !['/flow', '/flow/edit'].includes(to.path)) {
        localStorage.clear()
        return true
    }
    // Authorize leaving if nothing has been done
    if (!isRunning.value && receivedEnd.value) {
        localStorage.clear()
        return true
    }
    // should I stay or should I go now ?
    if (isRunning.value && !(warnBeforeLeave.value)) {
        leaveTo.value = to.path;
        warnBeforeLeave.value = true;
        return false
    }

    if (!isRunning.value && !receivedEnd.value) {
        sendTimerEnd.value = true
    }

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

    let tr =JSON.parse(localStorage.getItem('time_record'))
    tr.date = null
    tr.guid = null
    localStorage.setItem('time_record', JSON.stringify(tr))

    let wasTimer = flow.current.type == "timer"
    flow.current = {"type" : flow.current.type == "timer" ? "break" : "timer", "i": flow.current.i+1}
    localStorage.setItem('flow', JSON.stringify(flow))
    displayInfo.value.title = wasTimer ? "Break" : "Timer"

    localStorage.setItem("duration", flow.infos.f[flow.current.i][wasTimer ? "b" : "t"])

    if (!wasTimer) {
        hideEdit.value = false
    }
}

function handleQuit(answer) {
    if (answer == 'leave') {
        router.push(leaveTo)
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