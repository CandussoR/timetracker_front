<template>
    <main id="stats-dive">
        <h1>Dive into your stats</h1>

        <QueryForm @submitted="handleSubmit($event)" stats/>

    </main>
</template>

<script setup>
import QueryForm from '@/components/QueryForm.vue';
import { useStatStore } from '@/stores/stats';

const statStore = useStatStore()

async function handleSubmit(cleanedForm) {
    const res = await statStore.getQueriedStats(cleanedForm)
    console.log(res)
}
</script>

<style scoped>

</style>