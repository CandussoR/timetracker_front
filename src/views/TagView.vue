<template>
    <main id="tags">
        <h1>Your tags</h1>

        <ul id="tag-list-container" class="tag-list-container">
            <li :id="tag.tag.toLowerCase()" v-for="tag in tagStore.tags" :key="tag.guid" >
                <span class="tag">{{ tag.tag }}
                    <span class="material-symbols-outlined close-icon" @click="handleModalForGuid(tag.guid)">close</span>
                </span>
                <Overlay v-if="displayModal" @click="closeModal"/>
                <ModalFrame v-if="displayModal" content="confirmDelete"/>            
            </li>
        </ul>
    </main>
</template>

<script setup>
import {useTagStore} from '@/stores/tag'
import { onBeforeMount, provide, ref } from 'vue';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import Overlay from '@/components/Overlay.vue';

const tagStore = useTagStore()

onBeforeMount(() => {
  tagStore.index()
})

const displayModal = ref(false);
const guidToDelete = ref(null)

function closeModal() {
  displayModal.value = false
}

function handleModalForGuid(guid) {
  displayModal.value = true
  guidToDelete.value = guid
}

function handleDeleteChoice(choice) {
  if (choice === 'confirm') {
    tagStore.deleteTag(guidToDelete.value)
      .then((res) => console.log(res))
      .catch((error) => console.log(error))
  } else if (choice === 'canceled') {
    closeModal()
  }
}

provide('confirmDelete', handleDeleteChoice);
</script>

<style scoped>
  .tag {
      display:flex;
      font-size: .9em; 
      background: var(--accent);
      border-radius: 25px;
      padding: .2em 1em;
      place-items:center;
  }

  .close-icon {
    padding-left: .5em;
    font-size: 1em;
    color: var(--text);
  }

  .tag-list-container {
    background: var(--background-2);
    margin-bottom: 1em;
    padding: 2em;
    border-radius: 5px;
  }

  .tag-list-container {
    display: flex;
    gap: 1em;
    margin: 0 auto;
    max-width: 75%;
    flex-wrap: wrap;
  }

  li {
    list-style: none;
  }
</style>