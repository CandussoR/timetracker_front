<template>
    <div class="app">
        <StickyMenu/>
        <RouterView/>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import StickyMenu from './components/StickyMenu.vue';
</script>

<style>
    .app {
        display: flex;
    }
</style>
