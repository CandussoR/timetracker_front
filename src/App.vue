<template>
    <div class="app">
        <StickyMenu v-if="windowWidth > 764 && windowHeight > 630" :closeMenu="close" @expand="expandMenu" @close="closeMenu"/>
        <StickyMenuMobile v-else :closeMenu="close" @expand="expandMenu" @close="closeMenu"/>
        <Overlay v-if="menuExpanded" @click="closeMenu"/>
        <RouterView/>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import StickyMenu from './components/StickyMenu.vue';
import StickyMenuMobile from './components/StickyMenuMobile.vue';
import Overlay from './components/Overlay.vue';

const menuExpanded = ref(false)
const close = ref(false)
// Manage which sticky menu appears
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

onMounted(() => addEventListener('resize', handleResize))

function handleResize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
}
function expandMenu() {
    menuExpanded.value = true
    close.value = false
}
function closeMenu() {
    menuExpanded.value = false
    close.value = true
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
