<template>
    <div id="data-card-row">
        <div id="data-card-data__time-card" v-for="(p,nom) in filteredProps" :key="nom">
            <p id="num">{{ p }}</p>
            <p id="time">{{ nom }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(["day", "hours", "minutes", "seconds"])

const filteredProps = computed(() => {
    const filtered = {};
    for (const [key, value] of Object.entries(props)) {
        if (value !== undefined && value !== null && value !== '') {
            filtered[key] = value;
        }
    }
    return filtered;
});
</script>

<style scoped>
#data-card-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

#num {
    font-size: 4rem;
    justify-content: center;
}

#data-card-data__time-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#data-card-data__time-card:not(:last-child) {
  margin-right: 7%;
}
</style>