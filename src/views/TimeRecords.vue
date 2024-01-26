<template>
    <h1>Your time records</h1>

    <div v-if="selectedCriteria.includes('day')">
        <label for="day" name="day">Choose your date</label>
        <VueDatePicker id="day" 
                   v-model="day" 
                   :maxDate="new Date()" 
                   locale="fr" 
                   :model-value="day" 
                   model-type="yyyy-MM-dd" 
                   format='yyyy-MM-dd' 
                   auto-apply 
                   :enable-time-picker="false"
                   placeholder="Select a date"
                   @change="console.log(day)"/>
    </div>
    <div>
        <VueDatePicker v-if="selectedCriteria.includes('week')"
                id="week"
                v-model="week"
                model-type="yyyy-MM-dd"
                week-picker
                auto-apply
                placeholder="Select a week"
                @change="console.log(week)"
        />
        <VueDatePicker v-if="selectedCriteria.includes('month')"
                id="monthYear" 
                v-model="monthYear" 
                month-picker 
                locale="fr" 
                auto-apply
                model-type="yyyy-MM" 
                format='yyyy-MM'
                placeholder="Select a month"/>

        <VueDatePicker v-if="selectedCriteria.includes('year')"
                id="year" 
                v-model="year"
                :year-range="[2019, maxDate]"
                year-picker
                auto-apply
                :prevent-min-max-navigation="true"
                placeholder="Select a year"/>
    </div>

    <div class="otherChoice">
        <label for="criteriaSelect" name="criteriaSelect">Or use another criteria ! <br>You can even select multiple ones !</label>
        <select id="criteriaSelect" name="criteriaSelect" v-model="criteria" @change="handleCriteria(criteria)">
            <option v-for="pc in possibleCriteria" :key="pc" :value="pc">{{ pc }}</option>
        </select>
    </div>

    <button type="submit" @click="handleParams()">Get'em all</button>
</template>

<script setup>
import { useTimeRecordStore } from '@/stores/timeRecord';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import cleanObject from '../utils/cleanObject.js'

const timeRecordStore = useTimeRecordStore()
const maxDate = new Date().getFullYear()
const day = ref(null)
const week = ref(null)
const monthYear = ref(null)
const year = ref(null)
const task = ref('')
const subtask = ref('')
const tag = ref('')
const criteria = ref('')
const selectedCriteria = ref(['day'])
const possibleCriteria = ['day', 'week', 'month', 'year', 'task', 'subtask', 'tag']


/**
 * Swipe one temporal criteria with the new one if needed
 * 
 * @param {String} criteria 
 */
function handleCriteria(criteria) {
    const timespans = ['day', 'week', 'month', 'year']
    const vars = [day, week, monthYear, year]
    selectedCriteria.value = selectedCriteria.value.filter(() => !timespans.includes(criteria))
    vars.forEach(element => {element.value = null});
    selectedCriteria.value.push(criteria)
    console.log(selectedCriteria.value)
}

/**
 * Creates a clean dictionary of params for the get request.
 */
function handleParams() {
    const form = {
        "date" : day.value,
        "week" : week.value,
        "year" : year.value,
        "monthYear" : monthYear.value,
        "task" : task.value,
        "subtask" : subtask.value,
        "tag" : tag.value
    }
    const cleanedForm = cleanObject(form)
    timeRecordStore.getTimeRecords(cleanedForm)
}
</script>

<style scoped>
.dt {
    display: flex;
    flex-direction: row;
}

.otherChoice {
    display : flex;
    flex-direction: column;
}

select {
    width: fit-content;
    min-width: 10%;
}
</style>