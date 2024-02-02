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
        <TaskSelect v-if="selectedCriteria.includes('task')" :task="task" @selected="task = $event" />
        <SubtaskSelect v-if="selectedCriteria.includes('subtask')" :task="task" @selected="subtask = $event" />
        <TagSelect v-if="selectedCriteria.includes('tag')" :tag="tag" @selected="tag = $event" />
    </div>

    <div class="otherChoice">
        <label for="criteriaSelect" name="criteriaSelect">Or use another criteria ! <br>You can even select multiple ones !</label>
        <select id="criteriaSelect" name="criteriaSelect" v-model="criteria" @change="handleCriteria(criteria)">
            <option v-for="pc in possibleCriteria" :key="pc" :value="pc">{{ pc }}</option>
        </select>
    </div>

    <div v-if="pastRequests">
        <h2>Your old requests</h2>
        <div v-for="request in pastRequests" :key="request.id">
            <p @click="requested != null ? requested = null : requested = request.id">{{ request.id }}</p>
            <!-- <p @click="redirect(request.id)">{{ request.id }}</p> -->
            <div id="request-params">
                <div id="param-list" v-for="(value, key) in request.params" :key="key" class="param-enum">
                    <p id="param-item"><span class="param-key">{{ key }}</span> : {{ value }}</p>
                </div>
            </div>
        </div>
    </div>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <button type="submit" @click="handleParams()">Get'em all</button>

        
    <div v-if="records.length != 0">
        <!-- <div v-for="item in timeRecordStore.timeRecords" :key="item.guid"></div> -->
        <div v-for="(record, i) in records" :key="i">
            <TimeRecordCard :record="record"/>
        </div>
    </div>
</template>

<script setup>
import TimeRecordCard from '@/components/TimeRecordCard.vue';
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import { useTimeRecordStore } from '@/stores/timeRecord';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref } from 'vue';
import cleanObject from '../utils/cleanObject.js'
import { useRouter } from 'vue-router';

const router = useRouter()
const timeRecordStore = useTimeRecordStore()
const maxDate = new Date().getFullYear()
const day = ref(null)
const week = ref(null)
const monthYear = ref(null)
const year = ref(null)
const task = ref(null)
const subtask = ref('')
const tag = ref('')
const criteria = ref('')
const selectedCriteria = ref(['day'])
const possibleCriteria = ['day', 'week', 'month', 'year', 'task', 'subtask', 'tag']
const errorMsg = ref('')
const pastRequests = computed(() => {
  const storedData = localStorage.getItem('requests');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    return parsedData.map(x => ({ "id": x.id, "params": x.params }));
  } else {
    return [];
  }
});
const showParams = ref(false)
const requested = ref(null)
const records = computed(() => {
    if (requested.value) {
        const data = localStorage.getItem('requests');
        const parsed = JSON.parse(data)
        const filteredMap = parsed.filter(x => x.id == requested.value).map(x => x.data).flat()
        return [...filteredMap]
    }
    return []
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
        selectedCriteria.value = selectedCriteria.value.filter((c) => !timespans.includes(c))
        vars.forEach(element => {element.value = null});
    }
    selectedCriteria.value.push(criteria)
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
        .then((res) => console.log("we got a response", res))
        .catch((e) => errorMsg.value = e)
}

function redirect(id) {
    router.push({path : `time_records/${id}`})
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
</style>