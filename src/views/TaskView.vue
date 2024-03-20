<template>
  <main id="tasks">

    <h1>Your tasks</h1>

    <div :id="task" class="task-list-container" v-for="task in uniqueTasks" :key="task">

        <h2 :id="task + '-title'">{{ task[0].toUpperCase() + task.substring(1) }}</h2>

        <ul :id="task + '-subtask-list-container'" class="subtask-list-container">
            <li :id="task + '-' + (item.subtask !== null ? item.subtask.toLowerCase() : 'no-subtask')" 
              v-for="item in taskStore.tasks.filter(i => i.task_name.toLowerCase() === task)" 
              :key="item.guid"
            >
                <span class="task" v-if="item.subtask">{{ item.subtask }} <span class="material-symbols-outlined close-icon" @click="handleModalForGuid(item.guid)">close</span></span>
                <span class="task" v-else>{{ item.task_name }} <span class="material-symbols-outlined close-icon" @click="displayModal = true">close</span></span>
                <ModalFrame v-if="displayModal" content="confirmDelete" v-on-click-outside="closeModal"/>            
              </li>
        </ul>

    </div>


  </main>
</template>

<script setup>
import { computed, onBeforeMount, provide, ref } from 'vue';
import { useTaskStore } from '@/stores/task';
import { vOnClickOutside } from '@vueuse/components';
import ModalFrame from '@/components/modals/ModalFrame.vue';

const taskStore = useTaskStore()

const uniqueTasks = computed(() => {
  const tasks = []
  for (let i = 0; i < taskStore.tasks.length ; i++) {
    if (!tasks.includes(taskStore.tasks[i].task_name)) {
      tasks.push(taskStore.tasks[i].task_name)
    }
  }
  return tasks.map(t => t.toLowerCase())
})

const displayModal = ref(false);
const guidToDelete = ref(null)

onBeforeMount(() => {
  taskStore.index()
})

function closeModal() {
  displayModal.value = false
}

function handleModalForGuid(guid) {
  displayModal.value = true
  guidToDelete.value = guid
}

function handleDeleteChoice(choice) {
  if (choice === 'confirm') {
    taskStore.deleteTask(guidToDelete.value)
      .then((res) => console.log(res))
      .catch((error) => console.log(error))
  } else if (choice === 'canceled') {
    closeModal()
  }
}

provide('confirmDelete', handleDeleteChoice);

</script>

<style>
  h2 {
    margin-top: 0;
  }
  .task-list-container {
    background: var(--background-2);
    margin-bottom: 1em;
    padding: 1em;
    border-radius: 5px;
  }
  .task {
      display: flex;
      place-items: center;
      width: fit-content;
      border: none;
      color: var(--background);
      font-size: .9em;
      font-weight: 500;
      background: linear-gradient(.45turn, var(--text), 60%, var(--primary));
      border-radius: 25px;
      padding: .2em 1em;
  }
.close-icon {
        padding-left: .5em;
        font-size: 1em;
        color: var(--background);
    }

  .subtask-list-container {
    display: flex;
    gap: 1em;
    margin: 0 auto;
    max-width: 75%;
    flex-wrap: wrap;
  }
  p {
    display: inline;
    position: relative;
  }
  li {
    list-style: none;
  }
</style>