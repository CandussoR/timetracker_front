<template>
    <div id="time-record__card" class="time-record__card bg-2" 
        v-if="!editing" 
        @mouseenter="showEdit = true" 
        @mouseleave="showEdit = false">
        <span class="material-symbols-outlined icon-clear-gradient" v-if="showEdit" @click="toggleEdit(true)">edit</span>
        <p class="date">{{ record.date }}</p>
        <p class="record-task" v-if="record.subtask && record.tag">{{ record.task_name }} ({{ record.subtask }}) : <span class="tag"># {{ record.tag }}</span></p>
        <p class="record-task" v-else-if="record.tag">{{ record.task_name }} : <span class="tag"># {{ record.tag }}</span></p>
        <p class="record-task" v-else>{{ record.task_name }}</p>
        <p class="time-range">{{ record.time_beginning ?? 'Unknown' }} - {{ record.time_ending ?? 'Ongoing' }}</p>
        <!-- v-html is okay here because the log is sanitized. -->
        <div v-if="record.log">
            <div class="log" v-html="mdParse(record.log)"></div>
        </div>
    </div>

    <div id="record-update__form" class="form-container bg-2">
        <form @submit.prevent="handleSubmit">
            <div class="time-record__card--edit" v-if="editing">
                <fieldset>
                    <legend>Date & Time</legend>
                    <label class="bold" for="time-record-date">Date : </label>
                    <div class="datepicker">
                        <VueDatePicker id="time-record-date" 
                        name="time-record-date"
                        v-model="formRecord.date" 
                        :maxDate="new Date()" 
                        locale="fr" 
                        :model-value="formRecord.date" 
                        model-type="yyyy-MM-dd" 
                        format='yyyy-MM-dd' 
                        auto-apply 
                        :enable-time-picker="false"
                        placeholder="Select a date"/>
                    </div>
                    <div class="section-inputs">
                        <div class="datepicker">
                        <label class="bold" for="time-record-beginning">Time Beginning : </label>
                            <VueDatePicker id="time-record-beginning" 
                                            name="time-record-beginning"
                                            v-model="formRecord.timeBeginning"
                                            :model-value="formRecord.timeBeginning"
                                            model-type="HH:mm:ss" 
                                            format= "HH:mm:ss"
                                            time-picker
                                            enable-seconds
                                            />
                        </div>
                        <div class="datepicker">
                        <label class="bold" for="time-record-ending">Time Ending :</label>
                            <VueDatePicker id="time-record-ending"
                                            name="time-record-ending"
                                            v-model="formRecord.timeEnding"
                                            :model-value="formRecord.timeEnding"
                                            model-type="HH:mm:ss" 
                                            format= "HH:mm:ss"
                                            time-picker
                                            enable-seconds
                                            />
                        </div>                    
                    </div>
            </fieldset>
            <fieldset id="task__section">
                <legend>Task</legend>
                <div class="section-inputs">
                    <TaskSelect :task="formRecord.task_name" @selected="formRecord.task_name = $event"/>
                    <SubtaskSelect :task="formRecord.task_name" :subtask="formRecord.subtask" @selected="formRecord.subtask = $event"/>
                </div>
            </fieldset>
            <fieldset>
                <legend>Tag</legend>
                <TagSelect :tag="formRecord.tag" @selected="formRecord.tag = $event"/>
            </fieldset>
                <fieldset>
                    <legend>Log</legend>
                    <label class="bold" for="log" style="display: none">Log :</label> 
                    <textarea id="log" name="log" v-model="formRecord.log"/>
                </fieldset>
                <div class="button-row">
                    <button class="icon-clear-gradient" @click="handleSubmit()"><span class="material-symbols-outlined">done</span></button>
                    <button class="icon-clear-gradient" @click="toggleEdit(false)"><span class="material-symbols-outlined">cancel</span></button>
                </div>
            </div> 
        </form>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import TaskSelect from './select/TaskSelect.vue';
import SubtaskSelect from './select/SubtaskSelect.vue';
import TagSelect from './select/TagSelect.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useTimeRecordStore } from '@/stores/timeRecord';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { useStatStore } from '@/stores/stats';
import mdParse from '@/utils/markdownParser';

const props = defineProps(["record"])
const emit = defineEmits(["updated"])
const recordStore = useTimeRecordStore()
const taskStore = useTaskStore()
const tagStore = useTagStore()
const statStore = useStatStore()
const originalRecord = props.record
const showEdit = ref(false)
const showDone = ref(false)
const showCancel = ref(false)
const editing = ref(false)
const formRecord = ref({
    date : props.record.date,
    task_name : props.record.task_name,
    subtask : props.record.subtask,
    tag : props.record.tag,
    // Format for the time picker
    timeBeginning : 
        {
            hours: null,
            minutes: null,
            seconds: null
        },
    timeEnding : 
        {
            hours: null,
            minutes: null,
            seconds: null
        },
    log: props.record.log
})

onMounted(() => {
    formRecord.value.timeBeginning = createDateFromTimeString(formRecord.value.timeBeginning, 
                                                              ...props.record.time_beginning.split(":"))
    let time_ending = props.record.time_ending === null ? [0,0,0] : props.record.time_ending.split(":");
    formRecord.value.timeEnding = createDateFromTimeString(formRecord.value.timeEnding, 
                                                           ...time_ending)
});

function toggleEdit(truth) {
    editing.value = truth
    showCancel.value = truth
    showDone.value = truth
}

function createDateFromTimeString(valueToUpdate, hour, minutes, seconds) {
    valueToUpdate = {
        hours: hour | 0,
        minutes: minutes | 0,
        seconds: seconds | 0
    }
    return valueToUpdate
}

/**
 * Need to check if form is dirty before we make a request
 */
async function handleSubmit() {
    // Converts the time picker format to string if untouched
    if (typeof formRecord.value.timeBeginning !== "string") {
        const ftb = formRecord.value.timeBeginning
        formRecord.value.timeBeginning = `${ftb.hours}:${ftb.minutes}:${ftb.seconds}`
    }
    if (typeof formRecord.value.timeEnding !== "string") {
        const fte = formRecord.value.timeEnding
        formRecord.value.timeEnding = `${fte.hours}:${fte.minutes}:${fte.seconds}`
    }

    formRecord.value.guid = props.record.guid

    if (!areObjectEquals(originalRecord, formRecord.value)) {
        // Continuation of the spring cleaning : format, guids.
        if (formRecord.value.subtask !== '') formRecord.value.subtask = null
        formRecord.value.task_guid = taskStore.tasks.filter(x => x.task_name == formRecord.value.task_name 
                                                                && x.subtask == formRecord.value.subtask)
                                                    .map(x => x.guid)[0]
        delete formRecord.value.subtask 
        delete formRecord.value.task_name


        if (formRecord.value.tag === null) {
            formRecord.value.tag_guid = null
        } else {
            formRecord.value.tag_guid = tagStore.tags.filter(x => x.tag === formRecord.value.tag)
            .map(x => x.guid)[0]
        }
        delete formRecord.value.tag

        // make an update of the record.
        recordStore.updateTimeRecord(formRecord.value, "edit")
            .then((res) => {
                statStore.handleUpdated()
                emit("updated", res)
                editing.value = !editing.value
            })
    }
}

/**
 * Return false if objects don't have the same length
 * or if some keys have different values
 * 
 * @param {object} obj1 
 * @param {object} obj2 
 */
function areObjectEquals(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

    for (const key of Object.keys(obj1)) {
        if (obj2[key] !== obj1[key]) {
            return false
        }
    }
    return true
}

</script>

<style scoped>
    #record-update__form fieldset {
        margin-bottom: 0;
    }
    .time-record__card {
        position: relative;
        border-radius: 5px;
        padding: 1em;
    }
    .time-record__card > span {
        position: absolute;
        top: 1em;
        right: 1em;
    }

    button {
        border-width: 0;
    }

    .button-row {
        display: flex;
        justify-content: center;
        gap: 2em;
    }
    
    .log {
        width: 80%;
        margin: .5em auto;
        background-color: var(--background-3);
        border-radius: 5px;
        padding: 1em 2em;
    }

    strong {
        font-weight: bold;
    }

    .tag {
        font-size: .8em; 
        background: var(--accent);
        border-radius: 25px;
        padding: .2em 1em;
    }
</style>