<template>
    <main id="clock" v-if="displayInfo">
        <h1 >{{displayInfo.title}}</h1>
        <h2 v-if="flow.current.type == 'timer'">Timer {{flow.current.i + 1}} / {{flow.infos.f.length}}</h2>
        <h2 v-else>Break</h2>

        <div id="record__info" class="button-row" v-if="displayInfo && displayInfo.title != 'Break'">
            <p id="record__info-task" class="task" v-if="displayInfo.task_name">{{displayInfo.task_name}}
                <span id="record__info-subtask" v-if="displayInfo.subtask">({{displayInfo.subtask}})</span>
            </p>
            <p id="record__info-tag" class="tag" v-if="displayInfo.tag">{{displayInfo.tag}}</p>
            <span class="material-symbols-outlined icon-clear-gradient" @click="handleEdit" title="Edit task & tag">edit</span>
        </div>

        <TimerComponent @end="handleUpdateEnd($event)" @launch="hideEdit = !hideEdit" :break="displayInfo.title === 'Break'" :key="displayInfo.title"/>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useTimeRecordStore } from '../stores/timeRecord.js';
import { useRouter } from 'vue-router';
import TimerComponent from '@/components/TimerComponent.vue';
import { useStatStore } from '@/stores/stats.js';

const timeRecordStore = useTimeRecordStore()
const statStore = useStatStore();
const router = useRouter()
const displayInfo = ref(null)
const hideEdit = ref(false)

let flow = localStorage.getItem('flow')
if (flow) {
    flow = JSON.parse(flow)
}

onMounted(() => {
    if (flow) {
        console.log("that's a flow right there we need to do something!")
    }
    let di = localStorage.getItem('displayInfos');
    if (!di) {
        router.push('/new');
    } else {
        displayInfo.value = JSON.parse(di)
    }
})


function handleEdit() {
    router.push('/flow/edit');
}


async function handleUpdateEnd(tr) {
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
    } else {
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
    console.log("In update local storage with a flow, retrieving the time_record", tr)
    tr.date = null
    tr.guid = null
    localStorage.setItem('time_record', JSON.stringify(tr))

    let wasTimer = flow.current.type == "timer"
    flow.current = {"type" : flow.current.type == "timer" ? "break" : "timer", "i": flow.current.i+1}
    localStorage.setItem('flow', JSON.stringify(flow))
    displayInfo.value.title = wasTimer ? "Break" : "Timer"

    localStorage.setItem("duration", flow.info.f[flow.current.i][wasTimer ? "b" : "t"])

    if (!wasTimer) {
        hideEdit.value = false
    }
}
</script>

<style scoped>
main {
    display : flex;
    flex-direction : column;
    place-items : center;
}

@media screen and (max-height : 300px) {
    h1, p.task {
        display : none;
    }
}
@media screen and (max-height : 500px) {
    p.task {
        margin : .5rem auto;
    }
}
</style>