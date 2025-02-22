<template>
  <main id="stats-page">
    <div id="main" class="main-container">
      <h1>Stats</h1>
      <div id="time-span__header">
        <span id="left-arrow" :style="selected == 'D' ? 'visibility : hidden' : ''" class="material-symbols-outlined"
          @click="handleBack">arrow_back</span>
        <h2 v-if="selected === 'D'">Today</h2>
        <h2 v-else-if="selected === 'W'">This Week</h2>
        <h2 v-else-if="selected === 'M'">This Month</h2>
        <h2 v-else>This Year</h2>
        <span id="right-arrow" :style="selected == 'Y' ? 'visibility : hidden' : ''" class="material-symbols-outlined"
          @click="handleForward">arrow_forward</span>
      </div>

      <div v-if="loading" class="loader"></div>
      <GenericStats v-else :selector="selector[selected]" :selected="selected" />
    </div>
  </main>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStatStore } from '../stores/stats';
import GenericStats from '@/components/stats/GenericStats.vue';

const statStore = useStatStore()
const loading = ref(true)
const showDetails = ref(false)
const selected = ref("D")
const selector = {
    "D": "day",
    "W": "week",
    "M": "month",
    "Y": "year"
}

onMounted(async () => {
    // in case of a refresh which empties the store
    if (!statStore.daily) {
        await statStore.getHomeStats()
    }
    await statStore.getTaskTimeRatio(selector[selected.value])
    loading.value = false
})

async function handleBack() {
    showDetails.value = false
    if (selected.value != 'D') {
        const entries = Object.entries(selector).map(x => x[0])
        selected.value = entries[entries.indexOf(selected.value)-1]
        await statStore.getTaskTimeRatio(selector[selected.value])
    }
}

async function handleForward() {
    showDetails.value = false
    if (selected.value != 'Y') {
        const entries = Object.entries(selector).map(x => x[0])
        selected.value = entries[entries.indexOf(selected.value)+1]
        await statStore.getTaskTimeRatio(selector[selected.value])
    }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  margin: auto; 
}

main:last-child {
  margin-bottom: 2rem;
}

#time-span__header {
  width: 80%;
  position: relative;
  display : flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto;
}

#time-span__header:first-child {
  margin-left:auto;
}

#time-span__header > #left-arrow {
  margin-right: 5%;
}

span#right-arrow.material-symbols-outlined {
  margin-left: 5%;
}

@media screen and (min-width: 480px) {
  .main-container {
    width: 80%;
  }
}
</style>