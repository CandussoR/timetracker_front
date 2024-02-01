<template>
    <div>
        <input
            id="tagInput" name="tagInput" list="tagData" 
            v-model="selectedTag" 
            @change="emit('selected', selectedTag)"
            placeholder="Select a tag" />

        <datalist id="tagData">
            <option v-for="tag in tagStore.tags" :key="tag.tag">
                {{ tag.tag }}
            </option>
        </datalist>
    </div>
</template>

<script setup>
import { useTagStore } from '@/stores/tag.js'
import { ref, watch } from 'vue';
const tagStore = useTagStore()
tagStore.index()
const selectedTag = ref(null)
const emit = defineEmits(["selected"])
defineProps(["tag"])

watch(
    () => tagStore.isCreated,
    (newValue) => {
        if (newValue === true) {
            selectedTag.value = tagStore.createdTag.tag
        }
      })
</script>