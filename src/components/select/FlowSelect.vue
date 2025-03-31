<template>
    <div class="select-container">

        <label>Select your flow :</label>
        <div class="row">
            <select>
                <option v-if="props.flow" :value="props.flow" selected>{{props.flow}}</option>
                <option v-else value="" default selected>--</option>
                <option v-for="(f,i) in filteredFlows" :key="f" :value="i">{{f.n}} </option>
            </select>
            <span class="info-icon material-symbols-outlined icon-clear-gradient" @click="infos = !infos">help</span>
        </div>
        <div v-if="infos" class="infos">
            <ul>
                <li v-for="f in flowStore.inventoryDescriptions" :key="f.n">
                    <span class="flow-name">{{f.n + " : "}}</span>{{f.d}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { useFlowStore } from '@/stores/flow';
import { computed, ref } from 'vue';
const flowStore = useFlowStore();
const props = defineProps(['flow']);
const filteredFlows = computed(() => props.flow ? flowStore.inventory.filter(f => f !== props.flow) : flowStore.inventory)
const infos = ref(false)
</script>

<style scoped>
.row {
    display:flex;
    align-items: center;
    gap: 2rem;
}
.infos {
    margin-top : 2rem;
    background-color: var(--primary30);
    border-radius: 15px;
    padding: .5em 1em;
    font-size: .8em;
    width: fit-content;
}
span.flow-name {
    display: block;
    font-weight: bold;
}
</style>