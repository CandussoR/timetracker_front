<template>
    <div>
        <label>Select your flow :</label>
        <select>
            <option v-if="props.flow" :value="props.flow" selected>{{props.flow}}</option>
            <option v-else value="" default selected>--</option>
            <option v-for="(f,i) in filteredFlows" :key="f" :value="i"> {{f.n}} </option>
        </select>
    </div>
</template>

<script setup>
import { useFlowStore } from '@/stores/flow';
import { computed, onUnmounted } from 'vue';
const flowStore = useFlowStore();
const props = defineProps(['flow']);
const filteredFlows = computed(() => props.flow ? flowStore.inventory.filter(f => f !== props.flow) : flowStore.inventory)
</script>

<style scoped>
</style>