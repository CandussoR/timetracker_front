<template>
   <div class="form-container">
        <form>
            <fieldset id="date__section" v-if="isTimeCriteria">
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

            <fieldset id="stat__section" v-if="props.stats">
                <legend>Stats elements</legend>

                <p>Not selecting any element will result in a generic stat page alike to those of the resume page.</p>

                <p v-if="!isTimeCriteria && statForm" class="error">You have to select a period and dates.</p>

                <div v-for="s, i in selectedStatElement" :key="i">
                    <div class="fieldset">
                        <div class="legend">{{ statForm[i]['element'] }}</div>
                        <PeriodSelect @selected="statForm[i]['period'] = $event"/>
                    </div>
                </div>

                <div id="stats-section" class="stats-section">
                    <input type="checkbox" id="logs" name="logs" v-model="getLogsWithStats">
                    <label for="logs">Include logs</label>
                </div>
            </fieldset>

        </form>

        <div class="other-choice">
            <label for="criteriaSelect" name="criteriaSelect">Select your criteria(s)</label>
            <select id="criteriaSelect" name="criteriaSelect" v-model="criteria" @change="handleCriteria(criteria)">
                <option v-for="pc in possibleCriteria" :key="pc" :value="pc">{{ pc[0].toUpperCase() + pc.slice(1) }}</option>
            </select>
        </div>

        <div class="stats-section" v-if="props.stats">
            <label for="stats-element-select">
                Choose a stat element
            </label>
            <select id="stats-element-select" name="stats-element-select" @change="handleChange">Select sth
                <option value="">Select an element</option>
                <option value="line-chart">line chart</option>
                <option value="stacked-column-chart">stacked column</option>
                <option value="task-ratio">Task Ratio</option>
                <option value="subtask-ratio">Subtask Ratio</option>
            </select>

        </div>

        <button class="button" type="submit" @click="handleParams()">Get'em all</button>
    </div>
</template>

<script setup>
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, defineEmits, computed } from 'vue';
import cleanObject from '../utils/cleanObject.js'
import PeriodSelect from '@/components/select/PeriodSelect.vue';

const props = defineProps({
    stats : Boolean
})
const maxDate = new Date().getFullYear()
const criteria = ref(null)
const possibleCriteria = ['day', 'week', 'month', 'year', 'task', 'tag']
const day = ref(null)
const week = ref(null)
const monthYear = ref(null)
const year = ref(null)
const task = ref(null)
const subtask = ref(null)
const tag = ref(null)
const statForm = ref([])
const selectedCriteria = ref([])
const isTimeCriteria = computed(() => selectedCriteria.value.some(item => ['day', 'week', 'month', 'year'].includes(item)))
/** [ {"element" : sth, "column"}] */
const selectedStatElement = ref([])
const getLogsWithStats = ref(false)
const emit = defineEmits(['submitted'])

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

function handleChange(event) {
    selectedStatElement.value.push(event.target.value)
    // Fills the selectedStatElement array
    statForm.value.push({"element": event.target.value, "period": "", "date" : null})
    console.log(statForm.value)
    // Resets the selected value in case someone wants to times the same element with different units
    const select = document.getElementById("stats-element-select")
    select.selectedIndex = -1
}

/**
 * Creates a clean dictionary of params for the get request.
 */
function handleParams() {
    let rangeBeginning = null
    let rangeEnd = null
    const form = {
        "day" : day.value,
        "week" : week.value,
        "rangeBeginning" : rangeBeginning,
        "rangeEnd" : rangeEnd,
        "year" : year.value,
        "month" : monthYear.value,
        "task" : task.value,
        "subtask" : subtask.value,
        "tag" : tag.value
    }
    // Cleaning entries with null values
    const cleanedForm = cleanObject(form)

    if (props.stats && statForm.value.length !== 0) {
        console.log("we'll need to do sth about the stats")
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
</style>