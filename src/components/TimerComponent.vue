<template>
    <div id="timer-main">

        <p id="duration" class="num">{{ formattedDuration }}</p>

        <div id="error" class="error" v-if="err">
            <p>{{ err }}</p>
        </div>

        <button v-if="!timerRunning && !stopwatchRunning && !isDone" class="button"
            @click="currentDuration ? beginTimeRecord('timer') : beginTimeRecord('stopwatch')">
            <span class="material-symbols-outlined big"> play_circle </span>
        </button>
        <button v-else-if="(timerRunning || stopwatchRunning) && !isDone" class="button" @click="stopTheClock()">
            <span class="material-symbols-outlined"> stop_circle </span>
        </button>
        <div id="log-form" v-else>
            <h3>Log</h3>
            <textarea v-model="log"></textarea>
            <button class="button" @click="updateTimeRecord()">Send</button>
            <p id="success" name="success" class="success">{{ success }}</p>
            <div id="update-time">
                <p>In the end, you kept on going ? Don't worry !</p>
                <button class="button" @click="console.log('Not implemented yet but I heard that')">Update to
                    now</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStatStore } from '@/stores/stats';
import { useTimeRecordStore } from '@/stores/timeRecord';
import formatTime from '@/utils/formatTime';
import getCurrentDateTime from '@/utils/getCurrentDateTime';
import cleanObject from '@/utils/cleanObject';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const timeRecordStore = useTimeRecordStore()
const statStore = useStatStore()
const timeRecord = ref(null)
const log = ref(null)
const timerRunning = ref(false)
const stopwatchRunning = ref(false)
const isDone = ref(false)
const currentDuration = ref(0)
const formattedDuration = computed(() => formatTime(currentDuration.value))
console.log(formattedDuration)
const err = ref('')
const success = ref('')

// Initialising
timeRecord.value = JSON.parse(sessionStorage.getItem('time_record'))
// timeRecord.value = JSON.parse(data)
let data2 = sessionStorage.getItem('duration')
console.log(data2)
if (data2) {
    console.log("data2")
    currentDuration.value = Number(data2)
}
console.log(formattedDuration)

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

.big {
    scale: 1.5;
}
button span {
    display:flex;
    justify-content: center;
}
@media screen and (max-height : 500px) {
    p.num {
        margin : .5rem auto;
    }
}
</style>