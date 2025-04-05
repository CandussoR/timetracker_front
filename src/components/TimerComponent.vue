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
import { ref, computed, watchEffect, onUnmounted, onMounted } from 'vue';
import UpdateLastTimerButton from './UpdateLastTimerButton.vue';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import axios from '@/utils/apiRequester';
import { error } from '@tauri-apps/plugin-log';

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

let unlisten;

onMounted(async () => {
  unlisten = await listen("duration", (event) => {
    currentDuration.value = event.payload;
    if (timerRunning.value && event.payload == 0) {
        stopTheClock();
    }
  })
})

onUnmounted(() => {
    if (unlisten) unlisten()
    skip.value = false
})

// Initialising
timeRecord.value = JSON.parse(localStorage.getItem('time_record'))
let data2 = localStorage.getItem('duration')
if (data2) {
    currentDuration.value = Number(data2)
}

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

async function beginTimeRecord(clockType) {
    const { currentDate, currentTime } = getCurrentDateTime()
    const datetime = new Date(currentDate + ' ' + currentTime)

    timeRecord.value["date"] = currentDate
    timeRecord.value["time_beginning"] = currentTime

    const tr = cleanObject(timeRecord.value)
    
    try {
        const res = await timeRecordStore.createTimeRecord(tr, "begin")
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
    } catch(e) {
        (e) => err.value = e
    }
}


function skipBreak() {
    skip.value = true
    stopTheClock()
}


function startTheClock(type, beginningDatetime) {
    if (type === "timer") {
        timerRunning.value = true
    } else {
        stopwatchRunning.value = true
    }

    invoke("start_clock", {t: type, duration: currentDuration.value, beginning: beginningDatetime.toISOString()})
}


async function stopTheClock() {
    emit('stopped')
    invoke('stop_clock')

    timerRunning.value = false
    stopwatchRunning.value = false

    if (!(skip.value || props.break)) {
        timeRecord.value["time_ending"] = getCurrentDateTime().currentTime
    }
    isDone.value = true

    if (!props.send && !skip.value) {
        try {
        const res = await axios.get('/settings');
        const audio = new Audio(res.data.timer_ring ? res.data.timer_ring : import.meta.env.VITE_APP_RING)
        audio.play()
        } catch(e) {
            error("COULDN'T FETCH SETTINGS", e)
        }
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

@media screen and (max-height : 550px) {
    p.num {
        margin : 0 auto;
    }
}
</style>