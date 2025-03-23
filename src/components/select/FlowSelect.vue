<template>
    <div>
        <label>Select your flow :</label>
        <select>
            <option v-if="props.flow" :value="props.flow" selected>{{props.flow}}</option>
            <option v-else value="" default>--</option>
            <option value="one-time">One time flow</option>
            <option v-for="f in filteredFlows" :key="f.n" :value="f.n"> {{f.n}} </option>
        </select>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const props = defineProps(['flow']);
const flows = ref([])
onMounted(() => {
    // fake request to flows
    flows.value = [
        {"n": "Classic", "f" : [{"r": 3, "t": 1500, "b": 300}, {"r":1, "t": 1500, "b": 1200}]},
        {"n": "Mini", "f" : [{"r": 3, "t": 900, "b": 300}, {"r":1, "t": 900, "b": 900}]},
        {"n": "Maxi", "f" : [{"r": 3, "t": 3000, "b": 600}, {"r":1, "t": 3000, "b": 3000}]},
        {"n": "Progressive", "f" : [{"r": 1, "t": 900, "b":150}, {"r": 1, "t": 1200, "b":225}, {"r": 1, "t": 1500, "b":300}, {"r": 1, "t": 1900, "b":375}]},
        {"n": "Unmotivated", "f" : [{"r": 1, "t": 300, "b":120}, {"r": 1, "t": 900, "b":225}, {"r": 1, "t": 1500, "b":300}, {"r": 1, "t": 1900, "b":375}]}
    ]
})
const filteredFlows = computed(() => props.flow ? flows.value.filter(f => f.n !== props.flow) : flows.value)
</script>

<style scoped>
</style>