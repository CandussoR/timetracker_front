<template>
    <div>
        <label for="period">Select a period : </label>

        <select id="period" name="period" @change="emit('selected', $event.target.value)" required>
            <option disabled selected="">--</option>
            <option v-for="p in periods" :key="p" :value="p">
                {{ p }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(["selected"])
const periods = ref(["week", "month", "day" ])
</script>

<style scoped>

</style>