<template>
    <div>
        <div class="data-card">
            <div class="data-card-header">
                <span class="material-symbols-outlined" @click="handleBack">arrow_back</span>
                <div :class="selected === s ? 'data-card-header__item--selected' : 'data-card-header__item'" 
                    v-for="s in selectors" :key="s" @click="selected = s">
                    {{ s }}
                </div>
                <span class="material-symbols-outlined" @click="handleForward">arrow_forward</span>
            </div>
            <div class="data-card-data" v-if="data">
                <p class="data-card-data__count">{{ data.count }} {{ data.count === 1 ? "timer" : "timers" }}</p>
                <p class="data-card-data__time">{{ data.time }}</p>
            </div>
            <div id="stats-link"><p><a @click="router.push('/stats')">More stats</a></p></div>
            <div v-if="loading"><span class="loader"></span></div>
        </div>
    </div>

    <div id="buttons" class="buttons">
        <button class="button__timer" @click="redirect">New timer</button>
        <p v-if="success" id="success" class="success">{{ success }}</p>
        <p v-if="error" id="error" class="error">{{ error }}</p>
        <button class="button__update" @click="handleUpdate()">Update last timer to now</button>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import {useStatStore } from '../stores/stats';
import { useRouter } from 'vue-router';

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
.data-card {
    min-width: 400px;
    max-width: 500px;
    border: #EEEEEE 1px solid;
    border-radius: 10px;
    padding: 5px;
}

.data-card-header {
    display: flex;
    flex-direction: row;
}
.data-card-header__item {
    width: 25%;
    background-color: #E3E3E3;
    color: #303030;
    text-align: center;
    cursor: pointer;
}

.data-card-header__item--selected {
    width: 25%;
    background-color: #FAFAFA;
    color: #303030;
    text-align: center;
    cursor : pointer;
}
.data-card-data {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 2rem 0;
}

.data-card-data__count {
    font-size: 2rem;
}

.buttons {
    display : flex ;
    flex-direction: column;
    margin : 5%;
}

div#stats-link p {
    text-align: right;
}
.loader {
    .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
}

.button__timer {
    min-width: 100%;
    font-size: 1.5rem;
    border-radius: 10px;
    margin-bottom: 5%;
    border-color:#70CFFF;
}
</style>