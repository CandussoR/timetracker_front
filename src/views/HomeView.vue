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
                <div class="data-card-data" v-if="!loading">
                    <p class="data-card-data__count">{{ count }} {{ count === 1 ? "timer" : "timers" }}</p>
                    <TimeDisplay v-if="selectedKey && statStore[selectedKey].time" :time="statStore[selectedKey].time" :key="statStore[selectedKey].time"/>
                    <p v-else>--</p>
                    <div id="stats-link"><p><a @click="router.push('/stats')">More stats</a></p></div>
                </div>
                <div  class="loader-container" v-else>
                    <span class="loader"></span>
                </div>
            </div>
        </div>

        <div id="buttons" class="buttons">
            <button class="button" @click="redirect">New timer</button>
            <update-last-timer-button />
        </div>
    </main>
</template>

<script setup>
import UpdateLastTimerButton from '@/components/UpdateLastTimerButton.vue';
import { computed, onMounted, ref } from 'vue';
import {useStatStore } from '../stores/stats';
import { useRouter } from 'vue-router';
import TimeDisplay from '@/components/TimeDisplay.vue';

const router = useRouter()
const statStore = useStatStore()
const selectors = ["D", "W", "M", "Y"]
const selected = ref('')
const loading = ref(null)
const selectedDict = {"D" : "daily", "W": "weekly", "M" : "monthly", "Y": "yearly"}
const selectedKey = computed(() => selected.value ? selectedDict[selected.value] : null)
const count = computed(() => selectedKey.value ? statStore[selectedKey.value].count : null)

onMounted(async () => {
    loading.value = true
    if (statStore.updated) {
        await statStore.getHomeStats()
    }
    selected.value = "D"
    loading.value = false
})


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
}

.data-card-data__count {
    font-size: 2rem;
    margin: .5em 0 0;
}

.buttons {
    display : flex ;
    flex-direction: column;
    margin: 2rem auto 0 auto;
}

div#stats-link p {
    text-align: right;
    font-size: .9em;
    padding-right: 1rem;
}

.loader-container {
    display: flex;
    place-content: center;
    margin: .5rem 0;
}

@media screen and (max-width: 720px) {
    .buttons {
        margin-top: 1rem;
    }

    .data-card {
        min-width: 60%;
        max-width: 80%;
    }
}

/* Creating space for the sticky mobile menu button */
@media screen and ((max-width : 764px) or (max-height : 630px)) {
    .buttons {
        margin-top: 1rem;
    }

    .data-card {
        margin-top: 3.5rem;
        width: fit-content;
        height: fit-content;
    }
}
</style>