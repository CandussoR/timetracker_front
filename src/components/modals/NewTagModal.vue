<template>
        <h3>New Tag</h3>
        <div id="form-container" class="form-container">
            <form @submit.prevent="handleSubmit">
                <div>
                    <label for="newTag" class="hidden">New Tag</label>
                    <input id="newTag" type="text" placeholder="tag name" maxlength="30" v-model="tag" required/>
                </div>
                <p v-if="msg" class="success">{{ msg }}</p>
                <button class="button" type="submit">Create</button> 
            </form>
        </div>
</template>

<script setup>
import { useTagStore } from '@/stores/tag';
import { ref } from 'vue';
const tagStore = useTagStore()
const tag = ref(null)
const msg = ref('')

async function handleSubmit() {
    tagStore.isCreated = false
    const res = await tagStore.createTag(tag.value)
    if (res == 200) {
        msg.value = "Tag successfully created"
    }
}
</script>

<style>
.hidden {
    display: none;
}
input {
    width: 100%;
}
</style>