<template>
    <div class="form-container">
        <h2>Confirm Deletion</h2>

        <p>Are you sure you want to delete this task ?</p>

        <div class="button-row">
            <button class="button secondary" @click="$emit('confirm')">Yes</button>
            <button class="button" @click="$emit('cancel')">Cancel</button>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>

</style>