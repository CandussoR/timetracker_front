<template>
    <div class="app">
        <StickyMenu v-if="windowWidth > 764"/>
        <StickyMenuMobile v-else />
        <RouterView/>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import StickyMenu from './components/StickyMenu.vue';
import StickyMenuMobile from './components/StickyMenuMobile.vue';

// Manage which sticky menu appears
const windowWidth = ref(window.innerWidth)
onMounted(() => addEventListener('resize', handleResize))
function handleResize() {
    windowWidth.value = window.innerWidth
}
</script>

<style>
    .app {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    @media (max-width: 764px) {
        .app {
            flex-direction: column;
        }
    }
</style>
