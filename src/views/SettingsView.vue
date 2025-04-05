<template>
    <main>
        <h1>Settings</h1>
        <div v-if="database" class="small bg-2">
            <div class="entry">
                <div class="button-row">
                    <span class="material-symbols-outlined icon-clear-gradient" @click="select('database')"
                        title="Select another database">edit</span>
                    <span class="material-symbols-outlined icon-clear-gradient" @click="move"
                        title="Move database in another file"> drive_file_move </span>
                </div>
                <dl class="label">Database :</dl>
                <p>{{database}}</p>
                <p class="error" v-if="databaseError">{{databaseError}}</p>
            </div>
            <div class="entry">
                <div class="button-row">
                    <span class="material-symbols-outlined icon-clear-gradient" @click="select('timer_ring')" title="Select another ring">edit</span>
                    <span class="material-symbols-outlined" v-if="ring" @click="resetRing" title="reset to default ring"> restart_alt </span>
                </div>
                <dl class="label">Timer ring : </dl>
                <p>{{ring ? ring : "Default app ring"}}</p>
                <p class="error" v-if="audioError">{{audioError}}</p>
            </div>
            <div class="entry">
                <dl class="label">Log file : </dl>
                <p>{{log}}</p>
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "../utils/apiRequester";
import { open } from '@tauri-apps/plugin-dialog';
import { useStatStore } from "@/stores/stats";
import { useTagStore } from "@/stores/tag";
import { useTaskStore } from "@/stores/task";
import { useTimeRecordStore } from "@/stores/timeRecord";
const database = ref(null)
const ring = ref(null)
const log = ref(null)
const databaseError = ref(null)
const audioError = ref(null)

onMounted(async () => {
    const res = await axios.get('/settings')
    if (res.status == 200) {
        database.value = res.data.database;
        ring.value = res.data.timer_ring;
        log.value = res.data.log_file;
    } else {
        error.value = res.data.message
    }
})

async function resetRing() {
    audioError.value = null
    ring.value = ""
    try {
        const res = await axios.put('/settings', {"timer_ring" : ""})
        ring.value = res.data.timer_ring;
    } catch (e) {
        audioError.value = "Couldn't reset ring"
    }
}

async function select(settingsKey) {
    databaseError.value = null
    audioError.value = null
    const select = await open({ multiple: false, directory: false })
    const d = settingsKey == "database" ? { "database": select } : { "timer_ring": select }
    try {
        const res = await axios.put('/settings', d)
        if (res.status == 200) {
            if (settingsKey === 'database') {
                database.value = res.data.database
                const statStore = useStatStore();
                const tagStore = useTagStore();
                const taskStore = useTaskStore();
                const timeRecordStore = useTimeRecordStore();
                statStore.reset();
                tagStore.reset();
                taskStore.reset();
                timeRecordStore.reset();
            } else {
                ring.value = res.data.timer_ring
            }
        }
    }
    catch (e) {
        if (e.status == 400) {
            if (settingsKey == "database") {
                databaseError.value = e.response.data
            } else {
                audioError.value = e.response.data
            }
        } else {
            error.value = `A problem occured when trying to change ${settingsKey == "database" ? "database" : "ring"}.`
        }
    }
}

async function move() {
    databaseError.value = null
    const move = await open({ multiple:false, directory:true })
    try {
        const res = await axios.put('/settings', {"database" : move})
        database.value = res.data.database
    } catch(e) {
        databaseError.value = "Couldn't move the database."
    }
}
</script>

<style scoped>
main {
    display: flex;
    flex-direction: column;
}

.small {
    margin : 0 auto;
    padding: 1em;
    gap: 1em;
    border-radius : 5px;
    max-width: 80%;
}

div.button-row {
    position: absolute;
    display: flex;
    flex-direction: row;
    top: .2em;
    right: 1em;
}

.entry {
    position: relative;
    display: flex;
    flex-direction : column;
    padding: .5em;
}

.entry>span {
    position: absolute;
    top: 1em;
    right: 1em;
}

.label {
    display: block;
    font-size: 1.2em;
    font-weight : bold;
    margin-right : .5rem;
}

.icon-clear-gradient {
    padding : .5em;
}

dl .icon-clear-gradient:not(:last-child) {
    margin-right: 1rem;
}
dl .icon-clear-gradient:first-child {
    margin-left: 1rem;
}

p {
    margin-top: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
}
</style>