<template>
    <button @click="launchRecord">See datetime</button>
    <p>{{ formattedDuration }}</p>
    <div id="error" class="error" v-if="err">
        <p>{{ err }}</p>
    </div>
    <button v-if="!timerRunning && !stopwatchRunning && !isDone" 
            @click="currentDuration ? beginTimeRecord('timer') : beginTimeRecord('stopwatch')">
            Go !
    </button>
    <button v-else-if="(timerRunning || stopwatchRunning) && !isDone" 
            @click="stopTheClock()">
            Stop !
    </button>
    <div v-else>
        <textarea v-model="log"></textarea>
        <button @click="updateTimeRecord()">Send</button>
        <p id="success" name="success" class="success">{{ success }}</p>
        <div>
            <p>In the end, you kept on going ? Don't worry !</p>
            <button @click="console.log('Not implemented yet but I head that')">Update to now</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTimeRecordStore } from '../stores/timeRecord.js';
import cleanObject from '../utils/cleanObject.js';
import getCurrentDateTime from '../utils/getCurrentDateTime.js';
import { useRouter } from 'vue-router';

const router = useRouter()
const timeRecordStore = useTimeRecordStore()
const timerRunning = ref(false)
const stopwatchRunning = ref(false)
const isDone = ref(false)
const timeRecord = ref(null)
const log = ref(null)
const currentDuration = ref(0)
const interval = ref(0)
const err = ref('')
const success = ref('')
const formattedDuration = computed(() => {
    const hours = Math.floor(currentDuration.value / 3600)
    const minutes = Math.floor((currentDuration.value % 3600) / 60);
    const seconds = Math.floor(currentDuration.value % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
})


// Initialising
let data = sessionStorage.getItem('time_record')
timeRecord.value = JSON.parse(data)
let data2 = sessionStorage.getItem('duration')
if (data2) {
    currentDuration.value = Number(data2)
}

function beginTimeRecord(clockType) {
    const { currentDate, currentTime } = getCurrentDateTime()

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
                startTimer()
            } else {
                startStopwatch()
            }
        })
        .catch((e) => err.value = e)
}

function startTimer() {
    timerRunning.value = true
    interval.value = setInterval(() => {
        if (currentDuration.value != 0) {
            currentDuration.value--
        } else {
            stopTheClock()
        }
    }, 975)
}

function startStopwatch() {
    stopwatchRunning.value = true
    interval.value = setInterval(() => {
        currentDuration.value++;
    }, 975)
}

function stopTheClock() {
    timerRunning.value = false
    stopwatchRunning.value = false
    clearInterval(interval.value)
    const { currentDate, currentTime } = getCurrentDateTime()
    timeRecord.value["time_ending"] = currentTime 
    isDone.value = true
    // make a sound
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
    setTimeout(function() { router.push({ path: '/'})}, 2000)
}
</script>

<style scoped>
</style>