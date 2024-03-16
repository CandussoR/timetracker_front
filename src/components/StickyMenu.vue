<template>
    <aside id="menu">
        <!-- Only show a burger menu for mobile device -->
        <button id="menu-button" type="button" class="menu-button" v-if="windowWidth < 764" @click="toggleMobileMenu()">
            <span class="material-symbols-outlined">menu</span> 
             Menu
        </button>
        <!-- Show the menu on wider screens or at click of burger menu -->
        <div v-if="isToggled || windowWidth > 764" :class="[isExpanded ? 'menu is-expanded' : 'menu']">
            <div id="menu-wrap" class="menu-toggle" v-if="windowWidth > 764">
                <button id="wrap" type="button" class="wrap" @click="isExpanded = !isExpanded">
                    <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                </button>
            </div>
            <router-link to="/">
                <div class="menu-item" :class="{ active: route.path === '/' }">
                    <span class="material-symbols-outlined svg" @mouseover="home = !home" @mouseleave="home = !home">home</span>
                    <p class="primary" v-show="isExpanded">Home</p>
                </div>
            </router-link>   
            <router-link to="/new" >
                <div class="menu-item" :class="{ active: route.path === '/new' }">
                    <span class="material-symbols-outlined svg" @mouseover="clock = !clock" @mouseleave="clock = !clock">alarm</span>
                    <p class="primary" v-show="isExpanded">New clock</p>
                </div>
            </router-link>
            <router-link to="/old">
                <div class="menu-item" :class="{ active: route.path === '/old' }">
                    <span class="material-symbols-outlined svg" @mouseover="oldRecord = !oldRecord" @mouseleave="oldRecord = !oldRecord">alarm_add</span>
                    <p class="primary" v-show="isExpanded">Add Record</p>
                </div>
            </router-link>
            <router-link to="/time_records">
                <div class="menu-item" :class="{ active: route.path === '/time_records' }">
                    <span class="material-symbols-outlined svg" @mouseover="search = !search" @mouseleave="search = !search">search</span>
                    <p class="primary" v-show="isExpanded">New search</p>
                </div>
            </router-link>
            <router-link to="/stats">
                <div class="menu-item" :class="{ active: route.path === '/stats' }">
                    <span class="material-symbols-outlined svg" @mouseover="stats = !stats" @mouseleave="stats = !stats">bar_chart</span>
                    <p class="primary" v-show="isExpanded">Stats</p>
                </div>
            </router-link>   
        </div>
    </aside>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isExpanded = ref(false)
const isToggled = ref(false)

watch(router.currentRoute, () => {
    if (isExpanded.value) isExpanded.value = false;
    if (isToggled.value) isToggled.value = false;
  });

// Unmounts expand button from dom if width < 480 (portable)
const windowWidth = ref(window.innerWidth)
onMounted(() => addEventListener('resize', handleResize))
function handleResize() {
    windowWidth.value = window.innerWidth
}

function toggleMobileMenu() {
    if (isToggled.value && isExpanded.value) {
        isToggled.value = false
        isExpanded.value = false 
    } else {
        isToggled.value = true
        isExpanded.value = true
    }
}
</script>

<style scoped>
    .menu-button {
        appearance: none;
        border: none;
        outline: none;
        background: none;
        color: var(--text);
        display: flex;
        justify-items: flex-start;
        align-items: center;
        font-size: 1.5rem;
        width: 100vw;
        padding: 1em;
    }
    .menu {
        position: fixed;
        display: flex;
        flex-direction: column;
        width: max-content;
        background-color: var(--background);
        transition: 0.2s ease-out;
        z-index: 99;
        height: 100vh;
    }
    .menu-item {
            display: flex; 
            flex-grow: 1;
            align-items: center;
            margin-bottom: 1%;
    }
    .menu-item p {
            padding: 0 1rem;
            color: var(--background);
            background: var(--primary);
            font-weight: 500;
            border-radius: 0 0.3em 0.3em 0;
            justify-content: center;
            transform: translateX(-5px);
        }
    .material-symbols-outlined {
        font-size: clamp(1.5rem, 1.5rem, 3rem)
    }

    /* Menu item background + color styles */
    .menu-item:hover p, 
    .menu-item:hover .svg
    {
        color: var(--text);
        background: var(--accent); 
    }
    .menu-item.active p,
    .menu-item.active .svg {
        color: var(--text);
        background: var(--secondary);
    }
    /* Svg + p span style */
    span {
            display: flex;
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
            width: 3rem;
            height: 3rem;
        }
    p {
        width: calc(80% - 2%); /* width without the padding of the p to not deform the svg */
    }

    @media screen and (min-width: 764px) {
        .menu {
            /* Always keep the menu in the middle of the screen if in column */
            margin-right: 2em;
            top: 0; 
            bottom: 0;
            left: 0; 
            right: 0; 
            height: fit-content;
            margin: auto 0;
        }
        /* Whether expand, or unroll, or burger, make it smaller ? */
        span:first {
            width: 2rem;
            height: 2rem;
        }
        /* Styling the expand arrow */
        .menu-toggle {
            display:flex;
            justify-content: flex-end;
        }
        .wrap {
            background-color: var(--expanded);
            color: var(--text);
            border-style: none;
        }   
        .is-expanded .wrap {
            transform: rotate(-180deg); /* points inward when expanded */
        }
    }
</style>