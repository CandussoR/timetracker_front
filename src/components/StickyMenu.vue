<template>
    <aside :class="[isExpanded ? 'menu is-expanded' : 'menu']">
        <div id="menu-wrap" v-if="windowWidth > 764">
            <button id="wrap" type="button" class="wrap" @click="isExpanded = !isExpanded">
                <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
            </button>
        </div>
        <router-link to="/">
            <div class="menu-item">
                <span class="material-symbols-outlined svg" @mouseover="home = !home" @mouseleave="home = !home">home</span>
                <p class="primary" v-show="isExpanded">Home</p>
            </div>
        </router-link>   
        <router-link to="/new">
            <div class="menu-item">
                <span class="material-symbols-outlined svg" @mouseover="clock = !clock" @mouseleave="clock = !clock">alarm</span>
                <p class="primary" v-show="isExpanded">New clock</p>
            </div>
        </router-link>
        <router-link to="/old">
            <div class="menu-item">
                <span class="material-symbols-outlined svg" @mouseover="oldRecord = !oldRecord" @mouseleave="oldRecord = !oldRecord">alarm_add</span>
                <p class="primary" v-show="isExpanded">Add Record</p>
            </div>
        </router-link>
        <router-link to="/time_records">
            <div class="menu-item">
                <span class="material-symbols-outlined svg" @mouseover="search = !search" @mouseleave="search = !search">search</span>
                <p class="primary" v-show="isExpanded">New search</p>
            </div>
        </router-link>
        <router-link to="/stats">
            <div class="menu-item">
                <span class="material-symbols-outlined svg" @mouseover="stats = !stats" @mouseleave="stats = !stats">bar_chart</span>
                <p class="primary" v-show="isExpanded">Stats</p>
            </div>
        </router-link>   
    </aside>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const isExpanded = ref(false)

// Unmounts expand button from dom if width < 480 (portable)
const windowWidth = ref(window.innerWidth)
onMounted(() => addEventListener('resize', handleResize))
function handleResize() {
    windowWidth.value = window.innerWidth
}

</script>

<style scoped>
    .menu {
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 50%;
        transform: translateY(-50%);
        width: fit-content;
        transition: 0.2s ease-out;
        z-index: 99;
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

    .menu-item:hover p, .menu-item:hover .svg  {
        color: var(--text);
        background: var(--accent); 
    }

    /* Whether expand, or unroll, or burger, make it smaller ? */
    span:first {
        width: 2rem;
        height: 2rem;
    }

    span {
        display: flex;
        justify-content: center; /* Center horizontally */
        align-items: center;
        width: 3rem;
        height: 3rem;
    }

    .material-symbols-outlined {
        font-size: clamp(1.5rem, 1.5rem, 3rem)
    }

    .wrap {
        background-color: var(--expanded);
        color: var(--text);
        border-style: none;
    }

    @media (max-width: 764px) {
        .menu {
            width: 100%;
            flex-direction: row;
            justify-content: space-evenly;
            top: 1rem;
            background-color: var(--background);
            position: sticky;
        }
    }
</style>