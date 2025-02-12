<template>
        <h3>New Tag</h3>
        <div id="form-container" class="form-container">
            <form @submit.prevent="handleSubmit">
                <Info v-if="displayInfo" msg="A tag must not contain any space." />
                <div>
                    <label for="newTag" class="hidden">New Tag</label>
                    <input id="newTag" type="text" placeholder="tag name" maxlength="30" v-model="tag" required/>
                </div>
                <p v-if="successMsg" class="success">{{ successMsg }}</p>
                <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>
                <button class="button" type="submit">Create</button> 
            </form>
        </div>
</template>

<script setup>
import Info from '../Info.vue';
import { useTagStore } from '@/stores/tag';
import { ref } from 'vue';
const tagStore = useTagStore()
const tag = ref(null)
const successMsg = ref(null)
const errorMsg = ref(null)
const displayInfo = ref(false)

async function handleSubmit() {
    tagStore.isCreated = false
    displayInfo.value = false
    if (tag.value.includes(' ')) {
        displayInfo.value = true
        return
    }
    const res = await tagStore.createTag(tag.value)
    if (res.status == 200) {
        successMsg.value = "Tag successfully created."
    } else if (res.status == 422) {
        errorMsg.value = res.data
    } else {
        errorMsg.value = "An error occured."
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