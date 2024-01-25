<template>
    <div>
        <p>Stats Placeholder</p>
    </div>

    <div>
        <router-link to="/new">New timer</router-link>
    </div>
    <div>
        <p v-if="success" id="success" class="success">{{ success }}</p>
        <p v-if="error" id="error" class="error">{{ error }}</p>
        <button @click="handleUpdate()">Update last timer to now</button>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const success = ref('')
const error = ref('')

function handleUpdate() {
    axios.put('/time_records/last_to_now')
        .then(() => success.value = "Updated, boss.")
        .catch(() => error.value = "An error occured.")
}
</script>

<style scoped>

</style>