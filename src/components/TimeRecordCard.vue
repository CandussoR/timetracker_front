<template>
    <div class="time-record__card" v-if="!editing" @mouseenter="showEdit = true" @mouseleave="showEdit = false">
        <span class="material-symbols-outlined" v-if="showEdit" @click="editing = !editing">edit</span>
        <p class="bold">Date : {{ record.date }}</p>
        <p>Task guid : {{ record.task_guid }}</p>
        <p>Tag guid : {{ record.tag_guid }}</p>
        <div>
            <p>Time Beginning : {{ record.time_beginning ?? 'Unknown' }}</p>
            <p>Time Ending : {{ record.time_ending ?? 'Unknown' }}</p>
        </div>
        <p>Log : <br>{{ record.log }}</p>
    </div>

    <form>
        <div class="time-record__card--edit" v-if="editing" @mouseenter="showDone = true" @mouseleave="showDone = false">
            <span class="material-symbols-outlined" v-if="showDone" @click="editing = !editing"> done </span> 
            <label class="bold" for="time-record-date">Date : </label>
            <VueDatePicker id="time-record-date" 
                name="time-record-date"
                v-model="day" 
                :maxDate="new Date()" 
                locale="fr" 
                :model-value="day" 
                model-type="yyyy-MM-dd" 
                format='yyyy-MM-dd' 
                auto-apply 
                :enable-time-picker="false"
                placeholder="Select a date"/>
            <p>Task guid : {{ record.task_guid }}</p>
            <div>
                <label class="bold" for="time-record-beginning">Time Beginning : </label>
                <VueDatePicker id="time-record-beginning" 
                                name="time-record-beginning"
                                v-model="timeBeginning"
                                :model-value="timeBeginning"
                                model-type="HH:mm:ss" 
                                format= "HH:mm:ss"
                                time-picker
                                enable-seconds
                                />
                <label class="bold" for="time-record-ending">Time Ending :</label>
                <VueDatePicker id="time-record-ending"
                                name="time-record-ending"
                                v-model="timeEnding"
                                :model-value="timeEnding"
                                model-type="HH:mm:ss" 
                                format= "HH:mm:ss"
                                time-picker
                                enable-seconds
                                />
            </div>
            <label class="bold" for="log">Log :</label> 
            <textarea id="log" name="log" v-model="log"/>
        </div> 
    </form>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps(["record"])
const showEdit = ref(false)
const showDone = ref(false)
const editing = ref(false)
const day = ref(props.record.date)
const timeBeginning = ref({
    hours : null,
    minutes : null,
    seconds : null
})
const timeEnding = ref({
    hours : null,
    minutes : null,
    seconds : null
})
const log = ref(props.record.log)
function createDateFromTimeString(valueToUpdate, hour, minutes, seconds) {
    valueToUpdate.value = {
        hours : hour,
        minutes : minutes,
        seconds : seconds
    }
}
onMounted(() => {
    createDateFromTimeString(timeBeginning, ...props.record.time_beginning.split(":"))
    createDateFromTimeString(timeEnding, ...props.record.time_ending.split(":"))

});
</script>

<style scoped>

</style>