<template>
    <div class="buttons">
        <button class="button secondary" @click="handleUpdate()">Update last timer to now</button>
        <p v-if="success" id="success" class="success">{{ success }}</p>
        <p v-else-if="error" id="error" class="error">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/utils/apiRequester.js';
import { useStatStore } from '@/stores/stats';
let statStore = useStatStore();
let success = ref(null)
let error = ref(null)
async function handleUpdate() {
    success.value = ''
    error.value = ''

    let res = await axios.put('/time_records/last_to_now');
    if (res.status == 200) {
        success.value = "Updated, boss."
    } else {
        error.value = "An error occured."
    }

    await statStore.handleUpdated()

    setTimeout(function() { if (success.value) {
        success.value = ''
     } else {
        error.value = ''
      } 
    }, 1500)
}
</script>

<style scoped>
.buttons {
    display : flex ;
    flex-direction: column;
    margin: 0 auto;
}
</style>