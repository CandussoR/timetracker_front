<template>
    <div class="form-container">
        <div class="other-choice">
            <label for="criteriaSelect" name="criteriaSelect">Select your criteria :</label>
            <select id="criteriaSelect" name="criteriaSelect" v-model="criteria" @change="handleCriteria(criteria)">
                <option value="" disabled>--</option>
                <option v-for="pc in possibleCriteria" :key="pc" :value="pc">{{ pc[0].toUpperCase() + pc.slice(1) }}
                </option>
            </select>
        </div>

        <div class="stats-section" v-if="false">
            <label for="stats-element-select">
                Choose a stat element
            </label>
            <select id="stats-element-select" name="stats-element-select" @change="handleChange">Select sth
                <option value="">Select an element</option>
                <option value="timer-info">Timer count & total time</option>
                <option value="line-chart">line chart</option>
                <option value="stacked-column-chart" v-if="!subtask">stacked column</option>
                <option value="task-ratio" v-if="!subtask">Task Ratio</option>
                <option value="subtask-ratio">Subtask Ratio</option>
            </select>

        </div>

        <form>
            <fieldset id="date__section" class="fieldset" v-if="isTimeCriteria">
                <legend>Time</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('time')">close</span>
                <div>
                    <div class="datepicker">
                        <label for="day" name="day" v-if="selectedCriteria.includes('day')">Choose your day</label>
                        <label for="week" name="week" v-if="selectedCriteria.includes('week')">Choose your week</label>
                        <label for="month" name="month" v-if="selectedCriteria.includes('month')">Choose your month</label>
                        <label for="year" name="year" v-if="selectedCriteria.includes('year')">Choose your year</label>
                        <label for="range" name="range" v-if="selectedCriteria.includes('range')">Choose your range</label>
                        <VueDatePicker v-if="selectedCriteria.includes('day')" id="day" v-model="day"
                            :maxDate="new Date()" locale="fr" :model-value="day" model-type="yyyy-MM-dd"
                            format='yyyy-MM-dd' auto-apply :enable-time-picker="false" placeholder="Select a date" />
                        <VueDatePicker v-if="selectedCriteria.includes('week')" id="week" v-model="week"
                            :maxDate="new Date()" model-type="yyyy-MM-dd" week-picker auto-apply placeholder="Select a week" />
                        <VueDatePicker v-if="selectedCriteria.includes('month')" id="month" v-model="monthYear"
                            :maxDate="new Date()" month-picker locale="fr" auto-apply model-type="yyyy-MM" format='yyyy-MM'
                            placeholder="Select a month" />
                        <VueDatePicker v-if="selectedCriteria.includes('year')" id="year" v-model="year"
                            :year-range="[2019, maxDate]" year-picker auto-apply :prevent-min-max-navigation="true"
                            placeholder="Select a year" />
                    </div>
                    <div class="section-inputs" v-if="selectedCriteria.includes('range')">
                        <div class="datetime">
                            <VueDatePicker v-if="selectedCriteria.includes('range')" id="rangeBeginning" v-model="rangeBeginning"
                                :maxDate="new Date()" locale="fr" :model-value="rangeBeginning" model-type="yyyy-MM-dd"
                                format='yyyy-MM-dd' auto-apply :enable-time-picker="false"
                                placeholder="Beginning of range" />
                        </div>
                        <div class="datetime">
                            <VueDatePicker v-if="selectedCriteria.includes('range')" id="rangeEnding" v-model="rangeEnding"
                                :maxDate="new Date()" locale="fr" :model-value="rangeEnding" model-type="yyyy-MM-dd"
                                format='yyyy-MM-dd' auto-apply :enable-time-picker="false"
                                placeholder="End of range" />
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset id="task__section" class="fieldset" v-if="selectedCriteria.includes('task')">
                <legend>Task</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('task')">close</span>
                <div class="section-inputs">
                    <TaskSelect :task="task" @selected="task = $event" />
                    <SubtaskSelect :task="task" view="recordSearch" @selected="subtask = $event" />
                </div>
            </fieldset>

            
            <fieldset id="task__section" class="fieldset" v-if="selectedCriteria.includes('log includes')">
                <legend>Find in logs</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('log includes')">close</span>
                <div class="section-inputs">
                    <input type="text" v-model="logIncludes" minlength="3">
                </div>
            </fieldset>

            <fieldset id="tag__section" class="fieldset" v-if="selectedCriteria.includes('tag')">
                <legend>Tag</legend>
                <span class="material-symbols-outlined close-icon" @click="deleteSection('tag')">close</span>
                <div>
                    <TagSelect :tag="tag" @selected="tag = $event" />
                </div>
            </fieldset>

            <fieldset id="stat__section" class="fieldset" v-if="false">
                <legend>Stats elements</legend>
                <p id="generic-info" v-if="!statForm">Not selecting any element will result in a generic stat page alike
                    to those of the resume page.</p>
                <p id="date-missing-error" v-if="!hasTimeValue && statForm" class="error">You have to select at least
                    one date.</p>

                <div v-for="s, i in statForm" :key="i">
                    <div class="fieldset">
                        <div class="legend">{{ s['element'] }}</div>
                        <span class="material-symbols-outlined close-icon" @click="deleteStat(i)">close</span>
                        <PeriodSelect v-if="!['task-ratio', 'subtask-ratio', 'timer-info'].includes(s['element'])"
                            :span="selectedCriteria.filter(x => (x == 'day') || (x == 'week') || (x == 'month'))[0]"
                            @selected="s['column-period'] = $event" />
                    </div>
                    <p id='ratio-error' class="error" v-if="s['element'] == 'subtask-ratio' && !task">You must select a
                        task.</p>
                </div>

                <div id="stats-section" class="stats-section">
                    <input type="checkbox" id="logs" name="logs" v-model="getLogsWithStats">
                    <label for="logs">Include logs</label>
                </div>
            </fieldset>

        </form>
        <button id="submit" class="button" type="submit" @click="handleParams()" v-if="hasTimeValue || hasLogSearch"
            :disabled="(props.stats && allStatHavePeriod) || (!props.stats) || hasLogSearch ? false : true">Get'em all</button>
    </div>
</template>

<script setup>
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, computed, watch } from 'vue';
import cleanObject from '../utils/cleanObject.js'
import PeriodSelect from '@/components/select/PeriodSelect.vue';

const props = defineProps({
    stats : Boolean
})
const errorMsg = ref("")
const maxDate = new Date().getFullYear()
const criteria = ref(null)
const possibleCriteria = computed(() => {
    let ret = ['day', 'week', 'month', 'year', 'log includes']
    if (!(props.stats)) {
        ret.push('range', 'task', 'tag')
    }
    return ret
})
const day = ref(null)
const week = ref(null)
const monthYear = ref(null)
const year = ref(null)
const rangeBeginning = ref(null)
const rangeEnding = ref(null)
const task = ref(null)
const subtask = ref(null)
const tag = ref(null)
const logIncludes = ref(null)
const hasLogSearch = computed(() => selectedCriteria.value.includes('log includes') && logIncludes.value)
const statForm = ref([])
const selectedCriteria = ref([])
const isTimeCriteria = computed(() => selectedCriteria.value.some(item => ['day', 'week', 'month', 'year', 'range'].includes(item)))
// Insures there is one time value selected
const hasTimeValue = computed(() => {
    if (selectedCriteria.value.includes("tag")) {
        return true
    } else if (rangeBeginning.value && rangeEnding.value) {
        return true
    }
    return [day.value, week.value, monthYear.value, year.value].filter(i => i != null).length != 0
})

// Insures that every chart has a time unit specified
const allStatHavePeriod = computed(() => { 
   return statForm.value
            .filter(e => !['task-ratio', 'subtask-ratio', 'timer-info'].includes(e['element']))
            .map(e => ['week', 'month', 'day'].includes(e["column-period"]))
            .every(e => e == true)
})
/** [ {"element" : sth, "column"}] */
const selectedStatElement = ref([])

const getLogsWithStats = ref(false)

const emit = defineEmits(['submitted', 'change'])
watch([day, week , monthYear , year], () => emit('change'))

/**
 * Swipe one temporal criteria with the new one if needed
 *
 * @param {String} selected
 */
function handleCriteria(selected) {
    const timespans = ['day', 'week', 'month', 'year', 'range']
    const vars = [day, week, monthYear, year]
    if (timespans.includes(selected)) {
        // filters out all the criterias that are not included in timespans
        selectedCriteria.value = selectedCriteria.value.filter((c) => !timespans.includes(c))
        vars.forEach(element => {element.value = null});
    }
    selectedCriteria.value.push(selected)
    criteria.value = ""
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
    } else if (section === "log includes") {
        selectedCriteria.value = selectedCriteria.value.filter(item => item !== "log includes");
        logIncludes.value = null
    }
    emit('change')
}

function deleteStat(index) {
    statForm.value.splice(index, 1)
}

function handleChange(event) {
    selectedStatElement.value.push(event.target.value)
    // Fills the selectedStatElement array
    if (['task-ratio', 'subtask-ratio'].includes(event.target.value)) {
        if (statForm.value.findIndex(item => item.element === "timer-info") == -1) {
            statForm.value.push({"element" : "timer-info"})
        }
        statForm.value.push({"element" : event.target.value})
    } else if (event.target.value == 'timer-info') {
        statForm.value.push({"element" : "timer-info"})
    } else {
        statForm.value.push({"element": event.target.value, "column-period": null})
    }
    // Resets the selected value in case someone wants to times the same element with different units
    const select = document.getElementById("stats-element-select")
    select.selectedIndex = -1
}

/**
 * Creates a clean dictionary of params for the get request.
 */
function handleParams() {
    const form = {
        "day" : day.value,
        "week" : week.value,
        "rangeBeginning" : rangeBeginning.value,
        "rangeEnding" : rangeEnding.value,
        "year" : year.value,
        "month" : monthYear.value,
        "task" : task.value,
        "subtask" : subtask.value,
        "tag" : tag.value,
        "logIncludes" : logIncludes.value
    }
    // Cleaning entries with null values
    const cleanedForm = cleanObject(form)

    if (props.stats) {
        if (rangeBeginning.value & statForm.value.length === 0) {
            errorMsg.value = "You must specify the stat elements you want for a custom range."
            return ;
        }
        if (statForm.value.length !== 0) cleanedForm["stats"] = statForm.value
        if (getLogsWithStats.value) cleanedForm["logs"] = true
    }

    emit('submitted', cleanedForm)
}
</script>

<style scoped>
.stats-section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.stats-section > #logs {
    width: 1rem;
    margin : 0.4rem;
}
.fieldset {
    position: relative;
    margin-bottom: 2em; /* Add spacing between fieldsets */
    border : 0;
    border-radius: 15px;
    background-color: var(--background-2);
    padding: 1.5em;
}
.legend {
    display: flex;
    margin-bottom: 10px; /* Add spacing between legend and content */
    font-weight: bold;
    align-items: center;
}
.close-icon {
    position : absolute;
    font-size: 1.7em;
    top: -1.5em;
    right: 1em;
}
.other-choice {
    margin : 1.5rem auto;
}

@media screen and (min-width: 720px) {
  .other-choice {
    display: flex;
    place-items: center;
  }
  .other-choice label {
    white-space: nowrap;
    margin-right: 1rem;
  }
  .other-choice select {
    min-width: 200px;
  }
}
</style>