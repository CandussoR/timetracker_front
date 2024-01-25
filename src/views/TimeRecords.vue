<template>
    <h1>Your time records</h1>
    <div>
        <label for="date" name="date">Date :</label>
        <VueDatePicker v-model="date"></VueDatePicker>
    </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import { ref } from 'vue';

const date = ref(null)
</script>

<style scoped>

</style>