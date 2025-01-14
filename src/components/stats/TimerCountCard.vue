<template>
    <div id="resume-card" class="card" v-if="props.count && props.time">
        <p id="resume__count">{{ props.count }} {{ props.count === 1 ? "timer" : "timers" }}</p>
        <TimeDisplay v-if="props.time != 0" :time="props.time" :font="'medium'" />
        <p v-else>--</p>
    </div>
</template>

<script setup>
import TimeDisplay from '../TimeDisplay.vue';

const props = defineProps(["count", "time"])
</script>

<style lang="scss" scoped>

</style>