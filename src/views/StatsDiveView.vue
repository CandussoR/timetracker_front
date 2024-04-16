<template>
    <main id="stats-dive">
        <h1>Dive into your stats</h1>

        <QueryForm @submitted="handleSubmit($event)" stats/>

        <div id="stats-section" v-if="stats">
            <div v-for="(el, i) in stats" :key="i">
                <div v-for="(value, key) in el" :key="key">
                    <CustomBar v-if="['task-ratio', 'subtask-ratio'].includes(key)" :data="value"/>
                    <TaskRatioList v-if="['task-ratio', 'subtask-ratio'].includes(key)" :data="value"/>
                    <ApexBarChart v-if="key == 'stack-column-chart'"/>
                    <ApexLineChart v-if="key == 'line-chart'"/>
                </div>
            </div>
        </div>
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
import { useStatStore } from '@/stores/stats';
import { ref } from 'vue';

const statStore = useStatStore()
const stats = ref(null)
const logs = ref(null)

async function handleSubmit(cleanedForm) {
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
}

</script>

<style scoped>

</style>