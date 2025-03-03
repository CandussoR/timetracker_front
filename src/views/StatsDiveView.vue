<template>
    <main id="stats-dive">
        <h1>Dive into your stats</h1>

        <QueryForm @submitted="handleSubmit($event)" @change="mountGeneric = false" stats :key="queryCount"/>

        <div id="stats-section" v-if="stats">
            <div v-for="(el, i) in stats" :key="i">
                <div v-for="(value, key) in el" :key="key">
                    <TimerCountCard :count="value.count" :time="value.time" />
                    <CustomBar v-if="['task-ratio', 'subtask-ratio'].includes(key)" :data="value"/>
                    <TaskRatioList v-if="['task-ratio', 'subtask-ratio'].includes(key)" :data="value"/>
                    <ApexBarChart v-if="key == 'stacked-column-chart'" :options="value.labels" :series="value.series" :title="value.title"/>
                    <ApexLineChart v-if="key == 'line-chart'" :options="value.labels" :series="[value.series]" :title="value.title"/>
                </div>
            </div>
        </div>
        <GenericStats v-if="mountGeneric" :selector="genericRequest.selector" :selected="genericRequest.selected" :date="genericRequest.date" />
        <div id="logs-section" v-if="logs">
            <div v-for="(log, i) in logs" :key="i">
                <TimeRecordCard :record="log"/>
            </div>
        </div>
    </main>
</template>

<script setup>
import QueryForm from '@/components/QueryForm.vue';
import TimeRecordCard from '@/components/TimeRecordCard.vue';
import ApexBarChart from '@/components/stats/ApexBarChart.vue';
import ApexLineChart from '@/components/stats/ApexLineChart.vue';
import CustomBar from '@/components/stats/CustomBar.vue';
import TaskRatioList from '@/components/stats/TaskRatioList.vue';
import TimerCountCard from '@/components/stats/TimerCountCard.vue';
import { useStatStore } from '@/stores/stats';
import GenericStats from '@/components/stats/GenericStats.vue';
import { ref } from 'vue';

const statStore = useStatStore()
const queryCount = ref(0)
const stats = ref(null)
const logs = ref(null)
const mountGeneric = ref(false)
const genericRequest = ref(null)

async function handleSubmit(cleanedForm) {
    mountGeneric.value = false
    if (!("stats" in cleanedForm)) {
        genericRequest.value = null
        mountGeneric.value = true;
        genericRequest.value = getGenericRequestInfo(cleanedForm)
        queryCount.value++;
        return;
    }
    stats.value = null
    logs.value = null
    const res = await statStore.getQueriedStats(cleanedForm)
    const keys = Object.keys(res.data)
    console.log(keys)
    if (keys.includes("stats")) {
        stats.value = res.data["stats"]
    }
    if (keys.includes("logs")) {
        logs.value = res.data["logs"]
    }
    queryCount.value++;
}

function getGenericRequestInfo(form) {
    if ("day" in form) {
        return {'selector': 'day', 'selected' : 'D', 'date' : form['day']}
    } else if ("week" in form) {
        return {'selector': 'week', 'selected' : 'W', 'date' : form['week']}
    } else if ("month" in form) {
        return {'selector': 'month', 'selected' : 'M', 'date' : form['month']}
    } else if ("year" in form) {
        return {'selector': 'year', 'selected' : 'Y', 'date' : String(form['year'])}
    }
}

</script>

<style scoped>

</style>