<template>
    <div class="form-container">
        <h2>Confirm Deletion</h2>

        <p>Are you sure you want to delete this ?</p>

        <div class="button-row">
            <button class="button secondary" @click="handleDeleteChoice('confirm')">Yes</button>
            <button class="button" @click="handleDeleteChoice('canceled')">Cancel</button>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue';

const handleDeleteChoice = inject('confirmDelete')
</script>

<style scoped>

</style>