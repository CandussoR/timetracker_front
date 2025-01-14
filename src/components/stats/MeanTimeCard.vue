<template>
    <div id="mean-card" class="card" v-if="props.mean">
        <p>Mean {{ props.selected }}</p>
        <TimeDisplay v-if="props.mean.length" :time="props.mean" :font="'medium'" />
        <p v-else>--</p>
    </div>
</template>

<script setup>
import TimeDisplay from '../TimeDisplay.vue';
const props = defineProps(["mean", "selected"])
</script>

<style scoped>

</style>