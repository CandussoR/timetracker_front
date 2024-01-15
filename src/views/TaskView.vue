<template>
  <h1>Your tasks</h1>
  <div v-for="task in taskStore.tasks" :key="task.guid">
    <div class="task" @click="taskStore.deleteTask(task.guid)">
      <p> {{ task.task_name }}</p>
      <p> {{ task.subtask }}</p>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useTaskStore } from '@/stores/task';

const taskStore = useTaskStore()

onBeforeMount(() => {
  taskStore.index()
})
</script>

<style>
.task {
    border: 2px solid;
    margin-bottom : 2px;
    padding: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content:center;
    width: fit-content;
}
</style>