<template>
    <main id="search">
        <h1>Search time records</h1>
    
        <QueryForm @submitted="handleSubmit($event)"/>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    
        <h2 v-if="records.length !== 0">Search Results</h2>
        
        <div id="records-results" class="records-results" v-if="records.length !== 0">
            <div id="record" v-for="(record, i) in records" :key="record">
                <TimeRecordCard :record="record" @updated="handleRecordUpdate(i, $event)"/>
            </div>
        </div>
    </main>
    
</template>

<script setup>
import TimeRecordCard from '@/components/TimeRecordCard.vue';
import { onMounted, ref } from 'vue';
import { useTimeRecordStore } from '@/stores/timeRecord';
import QueryForm from '@/components/QueryForm.vue';

const timeRecordStore = useTimeRecordStore()
const errorMsg = ref('')
const requests = ref([])
const records = ref([])

onMounted(() => {
    const storedRequests = localStorage.getItem('requests');
    requests.value = storedRequests ? JSON.parse(localStorage.getItem('requests')).map(x => ({ "id": x.id, "params": x.params })) : [];
})

function handleRecordUpdate(idx, timeRecord) {
    records.value[idx] = timeRecord
}

function handleSubmit(cleanedForm) {
    records.value = []
    errorMsg.value = null
    timeRecordStore.getTimeRecords(cleanedForm)
        .then((res) => { records.value.push(...res.data.flat()) })
        .catch((e) => errorMsg.value = e)
}

</script>

<style scoped>
    .other-choice {
        display : flex;
        flex-direction: column;
        width: 70%;
        margin: auto;
        margin-bottom: 1.5em;
    }
    .form-container {
        gap: 3em;
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
    .records-results {
        margin: auto;
    }
    #record {
        margin-bottom: 1em;
    }

    @media screen and (min-width: 764px) {
        .records-results {
            width: 80%;
        }
    }
</style>