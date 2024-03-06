<template>
    <div id="custom-bar-chart">
        <div class="bar"
            :style="{ width: item.ratio + '%' }"
            v-for="(item, index) in statStore.taskRatio" 
            :key="index" 
            :class="['bar', 'task' + index]">
        </div>
    </div>
</template>

<script setup>
import { useStatStore } from '@/stores/stats';

const statStore = useStatStore()
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

    .task0 {
        background-color: blue;
    }
    .task1 {
        background-color: purple;
    }
    .task2 {
        background-color: beige;
    }
    .task3 {
        background-color: yellowgreen
    }
    .task4 {
        background-color: yellow
    }
</style>