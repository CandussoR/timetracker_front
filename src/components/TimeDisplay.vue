<template>
    <div id="data-card-row">
        <div id="data-card-data__time-card" class="unit-card" v-for="(num, i) in props.time" :key="num">
            <p id="num" :class="{'num-medium': font === 'medium', 'num': props.font !== 'medium'}">{{ num }}</p>
            <p id="time" class="time">{{ timeUnits[i] }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(["time", "font"])

const timeUnits = computed(() => {
        if (props.time.length === 4) {
            return ["day", "hours", "mins", "secs"]
        }
        return ["hours", "mins", "secs"]
    })
</script>

<style scoped>
#data-card-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.2em;
}

.num {
    --num-font: 1rem;
    text-align: center;
}
.num-medium {
    font-size: calc(var(--num-font) * .5);
    text-align: center;
}

.time {
    font-size: 0.7rem;
}

.unit-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#data-card-data__time-card:not(:last-child) {
  margin-right: 1em;
}

/* @media (min-width: 764px) {
    .num {
        --num-font: 4rem;
        font-style: var(--num-font);
    }
    .num-medium {
        font-size: calc(var(--num-font) * .5em);
    }
    } */

</style>