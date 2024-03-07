<template>

    <h1>Your time records</h1>

    <div class="form-container">
        <form>
            <fieldset id="date__section" v-if="selectedCriteria.some(item => ['day', 'week', 'month', 'year'].includes(item))">
                <legend>Time</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('time')">close</span>
                <div>
                    <div class="datepicker">
                        <label for="day" name="day" v-if="selectedCriteria.includes('day')">Choose your day</label>
                        <label for="week" name="week" v-if="selectedCriteria.includes('week')">Choose your week</label>
                        <label for="month" name="month" v-if="selectedCriteria.includes('month')">Choose your month</label>
                        <label for="year" name="year" v-if="selectedCriteria.includes('year')">Choose your year</label>
                        <VueDatePicker v-if="selectedCriteria.includes('day')"
                                   id="day" 
                                   v-model="day" 
                                   :maxDate="new Date()" 
                                   locale="fr" 
                                   :model-value="day" 
                                   model-type="yyyy-MM-dd" 
                                   format='yyyy-MM-dd' 
                                   auto-apply 
                                   :enable-time-picker="false"
                                   placeholder="Select a date"/>
                        <VueDatePicker v-if="selectedCriteria.includes('week')"
                                id="week"
                                v-model="week"
                                model-type="yyyy-MM-dd"
                                week-picker
                                auto-apply
                                placeholder="Select a week"/>
                        <VueDatePicker v-if="selectedCriteria.includes('month')"
                                id="month" 
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
                </div>
            </fieldset>

            <fieldset id="task__section" v-if="selectedCriteria.includes('task')">
                <legend>Task</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('task')">close</span>
                <div class="section-inputs">
                    <TaskSelect :task="task" @selected="task = $event" />
                    <SubtaskSelect :task="task" @selected="subtask = $event" />
                </div>
            </fieldset>

            <fieldset id="tag__section" v-if="selectedCriteria.includes('tag')">
                <legend>Tag</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('tag')">close</span>
                <div>
                    <TagSelect :tag="tag" @selected="tag = $event" />
                </div>
            </fieldset>
        
        </form>
        
        <div class="otherChoice">
            <label for="criteriaSelect" name="criteriaSelect">Or use another criteria ! <br>You can even select multiple ones !</label>
            <select id="criteriaSelect" name="criteriaSelect" v-model="criteria" @change="handleCriteria(criteria)">
                <option v-for="pc in possibleCriteria" :key="pc" :value="pc">{{ pc[0].toUpperCase() + pc.slice(1) }}</option>
            </select>
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" @click="handleParams()">Get'em all</button>
    
        <div v-if="requests">
            <h2>Your old requests</h2>
            <div v-for="(request, index) in requests" :key="index">
                <div id="request" @mouseenter="showDelete = true" @mouseleave="showDelete = false">
                    <span class="material-symbols-outlined" v-if="showDelete" @click="handleDelete(index)"> delete </span>
                    <p id="request-records" v-if="records.length === 0" @click="redirect(request.id)">{{ request.id }}</p>
                    <div id="request-params">
                        <div id="param-list" v-for="(value, key) in request.params" :key="key" class="param-enum">
                            <p id="param-item"><span class="param-key">{{ key }}</span> : {{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
   
    
</template>

<script setup>
import '@vuepic/vue-datepicker/dist/main.css';
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import cleanObject from '../utils/cleanObject.js'
import { onMounted, ref } from 'vue';
import { useTimeRecordStore } from '@/stores/timeRecord';
import { useRouter } from 'vue-router';

const router = useRouter()
const timeRecordStore = useTimeRecordStore()
const maxDate = new Date().getFullYear()
const showDelete = ref(false)
const day = ref(null)
const week = ref(null)
const monthYear = ref(null)
const year = ref(null)
const task = ref(null)
const subtask = ref(null)
const tag = ref(null)
const criteria = ref(null)
const selectedCriteria = ref(['day'])
const possibleCriteria = ['day', 'week', 'month', 'year', 'task', 'tag']
const errorMsg = ref('')
const requests = ref([])
const records = ref([])

onMounted(() => {
    requests.value = JSON.parse(localStorage.getItem('requests')).map(x => ({ "id": x.id, "params": x.params })) || [];
})

/**
 * Swipe one temporal criteria with the new one if needed
 * 
 * @param {String} criteria 
 */
function handleCriteria(criteria) {
    const timespans = ['day', 'week', 'month', 'year']
    const vars = [day, week, monthYear, year]
    if (timespans.includes(criteria)) {
        // filters out all the criterias that are not included in timespans
        selectedCriteria.value = selectedCriteria.value.filter((c) => !timespans.includes(c))
        vars.forEach(element => {element.value = null});
    }
    selectedCriteria.value.push(criteria)
}

/**
 * Deletes a section from the form by resetting the values associated to it.
 * 
 * @param {String} criteria 
 */
function deleteSection(section) {
    if (section === "time") {
        const timespans = ['day', 'week', 'month', 'year']
        const vars = [day, week, monthYear, year]
        selectedCriteria.value = selectedCriteria.value.filter((c) => !timespans.includes(c))
        vars.forEach(element => {element.value = null})
    } else if (section === "task") {
        selectedCriteria.value = selectedCriteria.value.filter(item => item !== "task");
        task.value = null
        subtask.value = null
    } else if (section === "tag") {
        selectedCriteria.value = selectedCriteria.value.filter(item => item !== "tag");
        tag.value = null
    }
}

/**
 * Creates a clean dictionary of params for the get request.
 */
function handleParams() {
    let rangeBeginning = null
    let rangeEnd = null
    if (week.value) {
        [rangeBeginning, rangeEnd] = week.value
    }
    const form = {
        "date" : day.value,
        "rangeBeginning" : rangeBeginning,
        "rangeEnd" : rangeEnd,
        "year" : year.value,
        "month" : monthYear.value,
        "task" : task.value,
        "subtask" : subtask.value,
        "tag" : tag.value
    }
    const cleanedForm = cleanObject(form)
    timeRecordStore.getTimeRecords(cleanedForm)
        .then((res) => { requests.value.push({ "id": res["id"], "params": res["params"] }) })
        .catch((e) => errorMsg.value = e)
}

function redirect(id) {
    router.push({path : `time_records/search/${id}`})
}

function handleDelete(index) {
    requests.value.splice(index, 1)
    localStorage.setItem('requests', JSON.stringify(requests.value))
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

.param-enum {
    display: flex;
}

.param-key {
    font-weight: bold
}

fieldset {
    position: relative;
}
.close-icon {
    position: absolute;
    font-size: 1.5em;
    top: -1.5em;
    right: 1em;
}
</style>