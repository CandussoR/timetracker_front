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
import { computed } from 'vue';
const props = defineProps(["span"])
const emit = defineEmits(["selected"])
const periods = computed(() => {
    switch(props.span) {
        case('day'):
        case('week'):
            return ["day"]
        case("month"):
            return ["day", "week"]
        case("year"):
            return ["day", "week", "month"]
        default:
            return ["day", "week", "month", "year"]
    }
})
</script>

<style scoped>

</style>