<template>
    <main id="home">
        <div>
            <div class="data-card">
                <div class="data-card-header">
                    <span class="material-symbols-outlined" @click="handleBack">arrow_back</span>
                    <div :class="selected === s ? 'data-card-header__item primary' : 'data-card-header__item secondary'" 
                        v-for="s in selectors" :key="s" @click="selected = s">
                        {{ s }}
                    </div>
                    <span class="material-symbols-outlined" @click="handleForward">arrow_forward</span>
                </div>
                <div class="data-card-data" v-if="data">
                    <p class="data-card-data__count">{{ data.count }} {{ data.count === 1 ? "timer" : "timers" }}</p>
                    <TimeDisplay v-if="data.time" :time="data.time"/>
                    <p v-else>--</p>
                </div>
                <div id="stats-link"><p><a @click="router.push('/stats')">More stats</a></p></div>
                <div v-if="loading"><span class="loader"></span></div>
            </div>
        </div>

        <div id="buttons" class="buttons">
            <button class="button" @click="redirect">New timer</button>
            <p v-if="success" id="success" class="success">{{ success }}</p>
            <p v-else-if="error" id="error" class="error">{{ error }}</p>
            <button class="button secondary" @click="handleUpdate()">Update last timer to now</button>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import {useStatStore } from '../stores/stats';
import { useRouter } from 'vue-router';
import TimeDisplay from '@/components/TimeDisplay.vue';

const router = useRouter()
const statStore = useStatStore()

const cardData = ref({
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null
})

const data = computed(() => {
    if (selected.value === "D") {
        return cardData.value.daily
    } else if (selected.value === "W") {
        return cardData.value.weekly
    } else if (selected.value === "M") {
        return cardData.value.monthly
    } else if (selected.value === "Y") { 
        return cardData.value.yearly
    } else {
        return null
    }
})

// Split the formatted time if there is one
// const timeData = computed(() => data.value.time.split(":") || null)
const selectors = ["D", "W", "M", "Y"]
const selected = ref('')
const loading = ref(null)
const success = ref('')
const error = ref('')

onMounted(async () => {
    loading.value = true
    if (statStore.updated) {
        await statStore.getHomeStats()
    }
    cardData.value.daily = statStore.daily
    cardData.value.weekly = statStore.weekly
    cardData.value.monthly = statStore.monthly
    cardData.value.yearly = statStore.yearly
    selected.value = "D"
    loading.value = false
})

function handleUpdate() {
    success.value = ''
    error.value = ''
    axios.put('/time_records/last_to_now')
        .then(() => success.value = "Updated, boss.")
        .catch(() => error.value = "An error occured.")
    statStore.handleUpdated()
}

function handleBack() {
    if (selected.value != 'D') {
        selected.value = selectors[selectors.indexOf(selected.value)-1]
    }
}

function handleForward() {
    if (selected.value != 'Y') {
        selected.value = selectors[selectors.indexOf(selected.value)+1]
    }
}

function redirect() {
    router.push("/new")
}
</script>

<style scoped>
main {
    /* height: 100vh; */
    min-height: 100vh;
    place-content: center;
    margin: 0;
}

div#buttons:last-child {
    margin-bottom: 1rem;
}

.data-card {
    margin: auto;
    min-width: 400px;
    max-width: 500px;
    border: #EEEEEE 1px solid;
    border-radius: 10px;
    padding: 5px;
}

.data-card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.data-card-header__item {
    width: 25%;
    text-align: center;
    cursor: pointer;
    font-size: 0.8rem;
}

.data-card-data {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem 0;
}

.data-card-data__count {
    font-size: 2rem;
}

.buttons {
    display : flex ;
    flex-direction: column;
    margin-top: 2rem;
}

.buttons > button {
    margin: 1.5em auto;
}
.buttons > button:last-of-type {
    margin: 0 auto;
}

div#stats-link p {
    text-align: right;
    font-size: .9em;
    padding-right: 1rem;
}

@media screen and (max-width: 720px) {
    .buttons {
        margin-top: 0;
    }

    .data-card {
        min-width: 60%;
        max-width: 80%;
    }
}

</style>