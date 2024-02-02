<template>
    <div class="time-record__card" @mouseenter="showEdit = true" @mouseleave="showEdit = false">
        <span class="material-symbols-outlined" v-if="showEdit">edit</span>
        <p class="bold">Date : {{ record.date }}</p>
        <p>Task guid : {{ record.task_guid }}</p>
        <div>
            <p>Time Beginning : {{ record.time_beginning ?? 'Unknown' }}</p>
            <p>Time Ending : {{ record.time_ending ?? 'Unknown' }}</p>
        </div>
        <p>Log : <br>{{ record.log }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps(["record"])
const showEdit = ref(false)
</script>

<style scoped>

</style>