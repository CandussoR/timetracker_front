<template>
    <div id="custom-bar-chart">
        <div class="bar"
            :style="{ width: item.ratio + '%' }"
            v-for="(item, index) in props.data" 
            :key="index" 
            :class="['bar', 'task' + index%13]">
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["data"])
</script>

<style scoped>
    #custom-bar-chart {
        display: flex;
        width: 75%; 
        min-height: 10px;
        margin: 2rem auto;
        border-radius: 2px;
    }

    .bar {
        min-height: 100%;
        position: relative;
        border-radius: 3px;
    }

    .bar:not(:last-child) {
        margin-right: 0.2rem;
    }
</style>