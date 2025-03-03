<template>
    <div class="app">
        <StickyMenu v-if="windowWidth > 764 && windowHeight > 630"/>
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
const windowHeight = ref(window.innerHeight)
onMounted(() => addEventListener('resize', handleResize))
function handleResize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
}
</script>

<style>
    .app {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    @media (max-width: 764px), (max-height: 630px) {
        .app {
            flex-direction: column;
        }
    }
</style>
