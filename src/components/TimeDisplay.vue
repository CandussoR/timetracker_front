<template>
    <div id="data-card-row">
        <div id="data-card-data__time-card" class="unit-card" v-for="(p,nom) in filteredProps" :key="nom">
            <p id="num" :class="{'num-medium': font === 'medium', 'num': props.font !== 'medium'}">{{ p }}</p>
            <p id="time" class="time">{{ nom }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(["day", "hours", "mins", "secs", "font"])

const filteredProps = computed(() => {
    const filtered = {};
    for (const [key, value] of Object.entries(props)) {
        if (value !== undefined && value !== null && value !== '' & key !== 'font') {
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
    align-items: center;
}

.num {
    font-size: 4rem;
    text-align: center;
}
.num-medium {
    font-size: 2rem;
    text-align: center;
}

.unit-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#data-card-data__time-card:not(:last-child) {
  margin-right: 7%;
}

</style>