<template>
    <main id="clock">
        <h1>{{timeRecordStore.displayOngoingInfos.clock || 'Timer'}}</h1>

        <div id="record__info" v-if="timeRecordStore.displayOngoingInfos">
            <p id="record__info-task" class="task" v-if="timeRecordStore.displayOngoingInfos.task_name">{{timeRecordStore.displayOngoingInfos.task_name}}
                <span id="record__info-subtask" v-if="timeRecordStore.displayOngoingInfos.subtask">({{timeRecordStore.displayOngoingInfos.subtask}})</span>
            </p>
            <p id="record__info-tag" class="tag" v-if="timeRecordStore.displayOngoingInfos.tag">{{timeRecordStore.displayOngoingInfos.tag}}</p>
        </div>

        <div id="timer-main">

            <p id="duration" class="num">{{ formattedDuration }}</p>

            <div id="error" class="error" v-if="err">
                <p>{{ err }}</p>
            </div>

            <button v-if="!timerRunning && !stopwatchRunning && !isDone" class="button"
                @click="currentDuration ? beginTimeRecord('timer') : beginTimeRecord('stopwatch')">
                Go !
            </button>
            <button v-else-if="(timerRunning || stopwatchRunning) && !isDone" class="button" @click="stopTheClock()">
                Stop !
            </button>
            <div id="log-form" v-else>
                <h3>Log</h3>
                <textarea v-model="log"></textarea>
                <button class="button" @click="updateTimeRecord()">Send</button>
                <p id="success" name="success" class="success">{{ success }}</p>
                <div id="update-time">
                    <p>In the end, you kept on going ? Don't worry !</p>
                    <button class="button" @click="console.log('Not implemented yet but I head that')">Update to now</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTimeRecordStore } from '../stores/timeRecord.js';
import cleanObject from '../utils/cleanObject.js';
import getCurrentDateTime from '../utils/getCurrentDateTime.js';
import { useRouter } from 'vue-router';
import { useStatStore } from '@/stores/stats';

const router = useRouter()
const timeRecordStore = useTimeRecordStore()
const statStore = useStatStore()
const timerRunning = ref(false)
const stopwatchRunning = ref(false)
const isDone = ref(false)
const timeRecord = ref(null)
const log = ref(null)
const currentDuration = ref(0)
const err = ref('')
const success = ref('')
const formattedDuration = computed(() => {
    const minutes = Math.floor((currentDuration.value % 3600) / 60);
    const seconds = Math.floor(currentDuration.value % 60);

    if (currentDuration.value >= 3600) {
        const hours = Math.floor(currentDuration.value / 3600)
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
})


// Initialising
let data = sessionStorage.getItem('time_record')
timeRecord.value = JSON.parse(data)
let data2 = sessionStorage.getItem('duration')
if (data2) {
    currentDuration.value = Number(data2)
}

let worker;

function beginTimeRecord(clockType) {
    const { currentDate, currentTime } = getCurrentDateTime()
    const datetime = new Date(currentDate + ' ' + currentTime)

    timeRecord.value["date"] = currentDate
    timeRecord.value["time_beginning"] = currentTime

    const tr = cleanObject(timeRecord.value)
    
    timeRecordStore.createTimeRecord(tr, "begin")
        .then((res) => {
            // puts it in the storage in case of refresh
            sessionStorage.setItem("time_record", JSON.stringify(res))
            // puts it in the timeRecord for convenience
            timeRecord.value = res

            if (clockType == "timer") {
                startTheClock("timer", datetime)
            } else {
                startTheClock("stopwatch", datetime)
            }
        })
        .catch((e) => err.value = e)
}

function startTheClock(type, beginningDatetime) {
    if (!window.Worker) {
        err.value = "Your browser doesn't support workers."
        return;
    }

    if (type === "timer") {
        timerRunning.value = true
    } else {
        stopwatchRunning.value = true
    }

    worker = new Worker('src/worker/clock.js')
    // duration is in seconds
    worker.postMessage({type: type, duration: currentDuration.value, beginning: beginningDatetime})
    worker.onmessage = (e) => {
        currentDuration.value = e.data
        if (type === "timer" && e.data === 0) {
            stopTheClock()
        }
    }
}

function stopTheClock() {
    if (worker) {
        worker.terminate();
        worker = null
    }
    timerRunning.value = false
    stopwatchRunning.value = false
    timeRecord.value["time_ending"] = getCurrentDateTime().currentTime
    isDone.value = true
    const audio = new Audio(import.meta.env.VITE_APP_RING)
    audio.play()
}

function updateTimeRecord() {
    const tr = {"guid" : timeRecord.value["guid"],
                "time_ending" : timeRecord.value["time_ending"],
                "log" : log.value}
    timeRecordStore.updateTimeRecord(tr, "ending")
        .then(() => {
            success.value = "Your timer has been saved. You will now be redirected."
            sessionStorage.removeItem('time_record')
            sessionStorage.removeItem('duration')
        })
        .catch((e) => err.value = e)
    statStore.handleUpdated()
    setTimeout(function() { router.push({ path: '/'})}, 2000)
}
</script>

<style scoped>
main {
    display : flex;
    flex-direction : column;
    place-items : center;
}

#timer-main, #log-form, #update-time {
    display : flex;
    flex-direction: column;
    place-items : center;
}

/* Doubled with the class in TimeDisplay */
.num {
    font-size: 5em;
    text-align: center;
}

textarea {
    margin-bottom: 1em;
}

@media screen and (max-height : 300px) {
    h1, p.task {
        display : none;
    }
}
@media screen and (max-height : 500px) {
    p.num, p.task {
        margin : .5rem auto;
    }
}
</style>