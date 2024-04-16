<template>
    <div id="task-list" class="task-list">
          <div id="task-item" class="task-item" :class="{ 'length3': maxElements === 3, 'length4': maxElements === 4 }" v-for="({ task, formatted, ratio }, index) in props.data" :key="task">
            
            <div id="color-task" class="color-task">
                <div class="box-color" :class="['box-color', 'task' + index]"></div>
                <div id="task-name" class="task-name">{{ task }}</div>
            </div>

            <div class="separator"></div>

            <div id="time-display">
              <TimeDisplay v-if="formatted.length" :time="formatted" :font="'medium'"/>
              <p v-else>--</p>
            </div>

            <div class="separator"></div>

            <div id="ratio" class="ratio">{{ ratio }} <span class="percent">%</span></div> 
         </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import TimeDisplay from '../TimeDisplay.vue';
// import { useStatStore } from '@/stores/stats';

// const statStore = useStatStore()
const props = defineProps(["data"])
const maxElements = computed(() => {
  let max = 3
  for (let i=0 ; i < props.data.length ; i++) {
    let len = props.data[i].formatted.length;
    if (len > max) return len
  }
  return max
})

</script>

<style scoped>
    .task-list {
        display: grid;
        justify-items: center;
        row-gap: 1em;
    }

    .task-item {
        display: grid;
        grid-template-columns: 1.5fr auto 2fr auto 1fr;        
        place-items : center;  
        border: solid 1px #ccc;
        border-radius: 10px;
        padding: .5em 1em;
        width: 100%;
    }

    .color-task {
        display: flex;
        gap: 1rem;
        align-items: flex-end;
    }
    .box-color {
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
    }

    .task-name {
        font-size: .9rem;
    }

    .separator {
        width: 1px;
        height: 50%;
        margin: 0 .5rem;
        background-color: #FFFFFFFF;
    }

    .ratio {
        font-size: .9rem;
        font-weight: 600;
    }

    .percent {
        font-size: .8rem;
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

    @media screen and (min-width: 794px) {
        .length3 {
            width: 75%;
        }
        .length4 {
            width: 80%;
        }
        .task-list {
            width: 100%;
        }
    }
</style>