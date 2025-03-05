<template>
    <main id="search">
        <h1>Search time records</h1>
    
        <QueryForm @submitted="handleSubmit($event)" />
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    
        <h2 v-if="records.length !== 0">Search Results</h2>
        
        <div id="records-results" class="records-results" v-if="records.length !== 0">
            <div id="record" v-for="(record, i) in records" :key="record">
                <TimeRecordCard :record="record" @updated="handleRecordUpdate(i, $event)"/>
            </div>
            <div id="pagination">
                <button class="button" :class="[currPage === 1 ? 'current' : '']" @click="getPage(1)" :disabled="currPage === 1 ? true : false">1</button>
                <button class="button" v-if="currPage > 4" disabled>...</button>
                <button class="button" v-if="currPage > 3" @click="getPage(currPage-2)">{{currPage - 2}}</button>
                <button class="button" v-if="currPage > 2" @click="getPage(currPage-1)">{{currPage - 1}}</button>
                <button class="button current" v-if="currPage != 1 && currPage != maxPage" disabled>{{currPage}}</button>
                <button class="button" v-if="currPage < (maxPage - 1)" @click="getPage(currPage+1)">{{currPage + 1}}</button>
                <button class="button" v-if="currPage < (maxPage - 2)" @click="getPage(currPage+2)">{{currPage + 2}}</button>
                <button class="button" v-if="currPage < (maxPage - 3)" disabled>...</button>
                <button class="button" @click="getPage(maxPage)" :disabled="currPage === maxPage ? true : false">{{maxPage}}</button>
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
const currRequest = ref(null)
const currPage = ref(1)
const pageSize = ref(20)
const maxPage = ref(0)

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
    maxPage.value = 0
    if (!currRequest.value) {
        currRequest.value = cleanedForm
        currRequest.value.page = 1
        currRequest.value.page_size = pageSize.value
    }
    timeRecordStore.getTimeRecords(currRequest.value)
        .then((res) => { 
            maxPage.value = res.data.pages
            records.value.push(...res.data.records.flat()) })
        .catch((e) => errorMsg.value = e)
}

function getPage(num) {
    currRequest.value.page = num
    currPage.value = num
    timeRecordStore.getTimeRecords(currRequest.value)
        .then((res) => { records.value = res.data.records.flat() })
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
    .records-results{
        display: flex;
        flex-direction: column;
        margin: auto;
    }
    #record {
        margin-bottom: 1em;
    }

    /* Pagination */
    div#pagination {
        margin: 0 auto 1em auto;
    }
    div#pagination .button {
        min-width: unset;
        width: fit-content;
        padding: .4em .6em;
    }
    .current {
        scale: 1.2;
        background-color: var(--accent);
    }
    button.current:disabled {
        background-color: var(--secondary);
        color: var(--text);
    }
    @media screen and (min-width: 764px) {
        .records-results {
            width: 80%;
        }
    }
</style>