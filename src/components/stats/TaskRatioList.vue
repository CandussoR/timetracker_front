<template>
    <div id="task-list" class="task-list">
          <div id="task-item" class="task-item" :class="{ 'length4': maxElements === 4, 'length3': maxElements === 3 }" v-for="({ task, formatted, ratio }, index) in statStore.taskRatio" :key="task">
            
            <div class="box-color" :class="['box-color', 'task' + index]"></div>
            <div id="task-name" :style="task.length < 8 ? {'font-size' : fontSize + 'rem'} : {}">{{ task }}</div>

            <div class="separator"></div>

            <div id="time-display" class="time-display">
              <TimeDisplay v-if="formatted.length === 4" :day="formatted[0]" :hours="formatted[1]" :mins="formatted[2]" :secs="formatted[3]" :font="'medium'"/>
              <TimeDisplay v-else-if="formatted.length === 3" :hours="formatted[0]" :mins="formatted[1]" :secs="formatted[2]" :font="'medium'"/>
              <p v-else>--</p>
            </div>

            <div class="separator"></div>

            <div id="ratio" class="ratio">{{ ratio }} <span class="percent">%</span></div> 
         </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
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

const fontSize = ref(1.5)
</script>

<style scoped>
    .task-list {
        display: grid;
        justify-items: center;
        row-gap: 2%;
    }

    .task-item {
        grid-template-columns: 0.5fr 1fr 1px 2fr 1px 1fr;
        display: grid;
        place-items : center;  
        border: solid 1px #ccc;
        border-radius: 10px;
        padding: 1% 0;
        padding-left: 2%;
    }
    .length4 {
        width: 70%;
    }
    .length3 {
        width: 50%;
    }

    .box-color {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .task-name {
        font-size: 1.5rem;
    }

    .separator {
        width: 1px;
        height: 50px;
        background-color: #FFFFFFFF;
    }

    .time-display {
        padding: 0 2%;
    }

    .ratio {
        font-size: 2rem;
        font-weight: 600;
    }

    .percent {
        font-size: 1rem;
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