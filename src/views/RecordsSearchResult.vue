<template>
    <router-link to="/time_records">New research</router-link>
    <div v-if="records.length != 0">
        <div v-for="(record, i) in records" :key="record">
            <TimeRecordCard :record="record" @updated="handleRecordUpdate(i, $event)"/>
        </div>
    </div>
</template>

<script setup>
import TimeRecordCard from '@/components/TimeRecordCard.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const records = ref([])

onMounted(() => {
    const stored = JSON.parse(localStorage.getItem('requests'))
    records.value = stored.filter(x => x.id === route.params.id)
                           .map(x => x.data)
                           .flat()
})

function handleRecordUpdate(idx, timeRecord) {
    const stored = JSON.parse(localStorage.getItem('requests'))
    for (let i = 0; i < stored.length; i++) {
        if (stored[i].data[idx].guid === timeRecord.guid) {
            stored[i].data[idx] = timeRecord 
        }
    }
    localStorage.setItem('requests', JSON.stringify(stored))
    records.value[idx] = timeRecord
}

</script>

<style lang="scss" scoped>

</style>