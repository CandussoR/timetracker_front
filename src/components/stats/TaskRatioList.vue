<template>
    <div id="task-list" class="task-list">
          <div id="task-item" class="task-item" :class="{ 'length4': maxElements === 4, 'length3': maxElements === 3 }" v-for="({ task, formatted, ratio }, index) in statStore.taskRatio" :key="task">
            
            <div class="box-color" :class="['box-color', 'task' + index]"></div>
            <div id="task-name" class="task-name">{{ task }}</div>

            <div class="separator"></div>

            <div id="time-display" class="time-display">
              <TimeDisplay v-if="formatted.length === 4" :day="formatted[0]" :hours="formatted[1]" :minutes="formatted[2]" :seconds="formatted[3]" :font="'medium'"/>
              <TimeDisplay v-else-if="formatted.length === 3" :hours="formatted[0]" :minutes="formatted[1]" :seconds="formatted[2]" :font="'medium'"/>
              <p v-else>--</p>
            </div>

            <div class="separator"></div>

            <div id="ratio" class="ratio">{{ ratio }}</div> 
         </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import TimeDisplay from '../TimeDisplay.vue';
import { useStatStore } from '@/stores/stats';

const statStore = useStatStore()

const maxElements = computed(() => {
  let max = 3
  for (let i=0 ; i < statStore.taskRatio.length ; i++) {
    let len = statStore.taskRatio[i].formatted.length;
    if (len > max) return len
  }
  return max
})
</script>

<style scoped>
    .task-list {
        display: grid;
        justify-items: center;
    }

    .task-item {
        grid-template-columns: 1fr 1fr 1px 2fr 1px 1fr;
        display: grid;
        place-items : center;  
        border: solid 1px #ccc;
        border-radius: 10px;
        padding: 1% 0;
    }
    .length4 {
        width: 70%;
    }
    .length3 {
        width: 50%;
    }
    .box-color {
        min-width: 25px;
        min-height: 25px;
    }

    .separator {
        width: 1px;
        height: 50px;
        background-color: #FFFFFFFF;
    }

    .time-display {
        padding: 0 2%;
    }

    .task-name {
        font-weight: bold;
    }

    .ratio {
        font-size: 2rem;
        font-weight: 600;
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
    }.task4 {
        background-color: yellow
    }
</style>