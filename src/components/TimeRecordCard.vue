<template>
    <div class="time-record__card" v-if="!editing" @mouseenter="showEdit = true" @mouseleave="showEdit = false">
        <span class="material-symbols-outlined" v-if="showEdit" @click="editing = !editing">edit</span>
        <p class="bold">Date : {{ record.date }}</p>
        <p>Task name : {{ record.task_name }}</p>
        <p v-if="record.subtask">Subtask : {{ record.subtask }}</p>
        <p v-if="record.tag">Tag : {{ record.tag }}</p>
        <div>
            <p>Time Beginning : {{ record.time_beginning ?? 'Unknown' }}</p>
            <p>Time Ending : {{ record.time_ending ?? 'Unknown' }}</p>
        </div>
        <p>Log : <br>{{ record.log }}</p>
    </div>

    <form @submit.prevent="handleSubmit">
        <div class="time-record__card--edit" v-if="editing" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <button type="submit" v-if="showDone"><span v-if="showDone" class="material-symbols-outlined"> done </span></button> 
            <span v-if="showCancel" class="material-symbols-outlined" @click="editing = !editing"> cancel </span>
            <label class="bold" for="time-record-date">Date : </label>
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
            <TaskSelect :task="formRecord.task_name" @selected="formRecord.task_name = $event"/>
            <SubtaskSelect :task="formRecord.task_name" :subtask="formRecord.subtask" @selected="formRecord.subtask = $event"/>
            <TagSelect :tag="formRecord.tag" @selected="formRecord.tag = $event"/>
            <div>
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
            <label class="bold" for="log">Log :</label> 
            <textarea id="log" name="log" v-model="formRecord.log"/>
        </div> 
    </form>

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

const props = defineProps(["record"])
const emit = defineEmits(["updated"])
const recordStore = useTimeRecordStore()
const taskStore = useTaskStore()
const tagStore = useTagStore()
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
    formRecord.value.timeEnding = createDateFromTimeString(formRecord.value.timeEnding, 
                                                           ...props.record.time_ending.split(":"))
});

function createDateFromTimeString(valueToUpdate, hour, minutes, seconds) {
    valueToUpdate = {
        hours: hour,
        minutes: minutes,
        seconds: seconds
    }
    return valueToUpdate
}

/**
 * Need to check if form is dirty before we make a request
 */
async function handleSubmit() {
    // Converts the time picker format to string if untouched
    if (typeof formRecord.value.timeBeginning != String) {
        const ftb = formRecord.value.timeBeginning
        formRecord.value.timeBeginning = `${ftb.hours}:${ftb.minutes}:${ftb.seconds}`
    }
    if (typeof formRecord.value.timeEnding != String) {
        const fte = formRecord.value.timeEnding
        formRecord.value.timeEnding = `${fte.hours}:${fte.minutes}:${fte.seconds}`
    }
    // First spring cleaning for the form.
    formRecord.value.guid = props.record.guid
    formRecord.value.time_beginning = formRecord.value.timeBeginning 
    formRecord.value.time_ending = formRecord.value.timeEnding 
    delete formRecord.value.timeBeginning 
    delete formRecord.value.timeEnding

    if (!areObjectEquals(originalRecord, formRecord.value)) {
        // Continuation of the spring cleaning : format, guids.
        if (formRecord.value.subtask !== '') formRecord.value.subtask = null
        formRecord.value.task_guid = taskStore.tasks.filter(x => x.task_name == formRecord.value.task_name 
                                                                && x.subtask == formRecord.value.subtask)
                                                    .map(x => x.guid)[0]
        if (formRecord.value.tag === null) {
            formRecord.value.tag_guid = null
        } else {
            formRecord.value.tag_guid = tagStore.tags.filter(x => x.tag === formRecord.value.tag)
            .map(x => x.guid)[0]
        }

        delete formRecord.value.subtask 
        delete formRecord.value.task_name
        delete formRecord.value.tag

        // make an update of the record.
        recordStore.updateTimeRecord(formRecord.value, "edit")
            .then((res) => {
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

function handleMouseEnter() {
    showDone.value = true
    showCancel.value = true
}

function handleMouseLeave() {
    showDone.value = false
    showCancel.value = false
}

</script>