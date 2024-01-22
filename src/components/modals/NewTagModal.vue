<template>
        <h3>New Tag</h3>
        <form @submit.prevent="handleSubmit(tag)">
            <div>
                <label for="newTag" hidden="hidden">New Tag</label>
                <input class="modalInput" id="newTag" type="text" placeholder="tag name" maxlength="30" v-model="tag" required/>
            </div>
            <p v-if="successMsg" class="success">{{ successMsg }}</p>
            <button class="modalButton" type="submit">Create</button> 
        </form>
</template>

<script setup>
import { useTagStore } from '@/stores/tag';
import { ref } from 'vue';
const tag = ref(null)
const msg = ref('')
const tagStore = useTagStore()

async function handleSubmit(tag) {
    const res = await tagStore.createTag(tag)
    if (res == 200) {
        msg.value = "Tag successfully created"
    }
}
</script>

<style scoped>
form {
    justify-content: space-evenly;
}
.success {
    color : #80ED99;
    font-weight: bold;
}
</style>