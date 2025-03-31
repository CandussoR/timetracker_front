<template>
    <div id="timer-main">

        <p id="duration" class="num">{{ formattedDuration }}</p>

        <div id="error" class="error" v-if="err">
            <p>{{ err }}</p>
        </div>

        <div class="row">
            <button v-if="!timerRunning && !stopwatchRunning && !isDone" class="button" @click="handleBeginClick">
                <span class="material-symbols-outlined big"> play_circle </span>
            </button>
            <button v-else-if="(timerRunning || stopwatchRunning) && !isDone" class="button" @click="stopTheClock()">
                <span class="material-symbols-outlined big"> stop_circle </span>
            </button>
            <button v-if="props.break" class="button" @click="skipBreak">
                <span class="material-symbols-outlined big" title="skip the break"> skip_next </span>
            </button>
        </div>

        <div id="log-form" v-if="!(props.break) && isDone">
            <h3>Log</h3>
            <textarea v-model="log"></textarea>
            <button class="button" @click="props.break ? stopTheClock : updateTimeRecord()">Send</button>
            <div id="update-time">
                <p>In the end, you kept on going ? Don't worry !</p>
                <update-last-timer-button />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTimeRecordStore } from '@/stores/timeRecord';
import formatTime from '@/utils/formatTime';
import getCurrentDateTime from '@/utils/getCurrentDateTime';
import cleanObject from '@/utils/cleanObject';
import { ref, computed, watchEffect, onUnmounted } from 'vue';
import UpdateLastTimerButton from './UpdateLastTimerButton.vue';

const props = defineProps({break : Boolean, send : Boolean})
const emit = defineEmits(['end', 'launch', 'stopped'])
const timeRecordStore = useTimeRecordStore()
const timeRecord = ref(null)
const log = ref(null)
const timerRunning = ref(false)
const stopwatchRunning = ref(false)
const skip = ref(false)
const isDone = ref(false)
const currentDuration = ref(0)
const formattedDuration = computed(() => formatTime(currentDuration.value))
const err = ref('')


watchEffect(() => {if (props.send) {
    timeRecord.value["time_ending"] = getCurrentDateTime().currentTime
    updateTimeRecord()
}})

onUnmounted(() => skip.value = false)

// Initialising
timeRecord.value = JSON.parse(localStorage.getItem('time_record'))
let data2 = localStorage.getItem('duration')
if (data2) {
    currentDuration.value = Number(data2)
}

let worker;

function handleBeginClick() {
    if (props.break) {
        const { currentDate, currentTime } = getCurrentDateTime()
        const datetime = new Date(currentDate + ' ' + currentTime)
        startTheClock("timer", datetime)
        return;
    }

    if (currentDuration.value) {
        beginTimeRecord('timer')
    } else {
        beginTimeRecord('stopwatch')
    }
}

function beginTimeRecord(clockType) {
    const { currentDate, currentTime } = getCurrentDateTime()
    const datetime = new Date(currentDate + ' ' + currentTime)

    timeRecord.value["date"] = currentDate
    timeRecord.value["time_beginning"] = currentTime

    const tr = cleanObject(timeRecord.value)
    
    timeRecordStore.createTimeRecord(tr, "begin")
        .then((res) => {
            // puts it in the storage in case of refresh
            localStorage.setItem("time_record", JSON.stringify(res))
            // puts it in the timeRecord for convenience
            timeRecord.value = res

            emit('launch')
            if (clockType == "timer") {
                startTheClock("timer", datetime)
            } else {
                startTheClock("stopwatch", datetime)
            }
        })
        .catch((e) => err.value = e)
}


function skipBreak() {
    skip.value = true
    stopTheClock()
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
    emit('stopped')
    timerRunning.value = false
    stopwatchRunning.value = false
    if (!(skip.value || props.break)) {
        timeRecord.value["time_ending"] = getCurrentDateTime().currentTime
    }
    isDone.value = true

    if (!props.send && !skip.value) {
        const audio = new Audio(import.meta.env.VITE_APP_RING)
        audio.play()
    }
    if (props.break) {
        emit('end', null)
    }
}


function updateTimeRecord() {
    const tr = {"guid" : timeRecord.value["guid"],
                "time_ending" : timeRecord.value["time_ending"],
                "log" : log.value}
    emit('end', tr)
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

.row {
    display: flex;
    flex-direction: row;
    gap: 1em;
    margin: 0 auto;
}

@media screen and (max-height : 500px) {
    p.num {
        margin : .5rem auto;
    }
}
</style>