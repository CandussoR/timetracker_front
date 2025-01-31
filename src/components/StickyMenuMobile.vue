<template>
    <aside id="menu">
        <button id="menu-button" type="button" class="menu-button" @click="toggleMobileMenu()">
            <span class="material-symbols-outlined">menu</span>
            Menu
        </button>
        <!-- Creates a mask which darkens the background and act as a closer when clicking, like vue-click-outside -->
        <div id="mask" class="overlay" v-if="isToggled" @click="toggleMobileMenu()"></div>
        <!-- Creating a drawer -->
        <div class="menu" v-if="isToggled">
            <ul>

                <li>
                    <router-link to="/">
                        <div class="menu-item" :class="{ active: route.path === '/' }">
                            <span class="material-symbols-outlined">home</span>
                            <span>Home</span>
                        </div>
                    </router-link>
                </li>

                <li>
                    <router-link to="/new">
                        <div class="menu-item" :class="{ active: route.path === '/new' }">
                            <span class="material-symbols-outlined">alarm</span>
                            New clock
                        </div>
                    </router-link>
                </li>

                <li>
                    <router-link to="/old">
                        <div class="menu-item" :class="{ active: route.path === '/old' }">
                            <span class="material-symbols-outlined">alarm_add</span>
                            Add Record
                        </div>
                    </router-link>
                </li>

                <li>
                    <router-link to="/time_records">
                        <div class="menu-item" :class="{ active: route.path === '/time_records' }">
                            <span class="material-symbols-outlined">search</span>
                            New search
                        </div>
                    </router-link>
                </li>

                <li class="submenu">
                    <details>
                        <summary id="disclosure-edit" class="menu-item"
                            :class="{ active: route.path == '/tasks' || route.path === '/tags' }">
                            <span class="material-symbols-outlined">edit</span>
                            <span>Edit</span>
                        </summary>
                        <ul id="edit-submenu">
                            <li>
                                <router-link to="/tasks">
                                    <div class="menu-item" :class="{ active: route.path === '/tasks' }">Tasks</div>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/tags">
                                    <div class="menu-item" :class="{ active: route.path === '/tags' }">Tags</div>
                                </router-link>
                            </li>
                        </ul>
                    </details>
                </li>

                <li id="stats-menu" class="submenu">
                    <details>
                        <summary id="stats-disclosure" class="menu-item"
                            :class="{ active: route.path === '/stats' || route.path === '/stats/dive' }">
                            <span class="material-symbols-outlined ">bar_chart</span>
                            Stats
                        </summary>
                        <ul id="stats-submenu">
                            <li>
                                <router-link to="/stats">
                                    <div class="menu-item" :class="{ active: route.path === '/stats' }">Resume</div>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/stats/dive">
                                    <div class="menu-item" :class="{ active: route.path === '/stats/dive' }">Dive Into
                                    </div>
                                </router-link>
                            </li>

                        </ul>
                    </details>
                </li>

            </ul>
        </div>
    </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isToggled = ref(false)
watch(router.currentRoute, () => {
    if (isToggled.value) isToggled.value = false;
  });
function toggleMobileMenu() {
    isToggled.value = !isToggled.value
}
</script>

<style scoped>
:root {
    --level: .5rem;
}

.menu-button {
        appearance: none;
        border: none;
        outline: none;
        background: none;
        color: var(--text);
        display: flex;
        gap: 1rem;
        justify-items: flex-start;
        align-items: center;
        font-size: 1.5rem;
        width: 100vw;
        padding: 1rem 0;
    }

.overlay {
    position: fixed;
    top: 0;
    left : 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(1px);
    z-index: 98;
}

.menu {
    z-index : 99;
    top: 0;
    left: 0;
    position: fixed;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-snap-align: start end;
    background-color: var(--background-3);
    height: 100vh;
    width: fit-content;
    backdrop-filter: blur(10px);
    /* Hiding scrollbar for Firefox and Edge */
    -ms-overflow-style: none;
    scrollbar-width: none;
}
/* Hiding scrollbar for Chrome, Safari, Opera */
.menu::-webkit-scrollbar {
    display: none;
}

ul {
    padding-left: 1rem;
    padding-right: 1rem;
}
ul#edit-submenu {
    margin-bottom: .3rem;
}

li {
    list-style: none;
    height: 3rem;
}

/* Hiding arrows */
details > summary {
    list-style: none;
}

.menu-item {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    padding: .3rem 3rem .3rem 1rem;
    align-items: center;
}
.menu-item:not(#stats-disclosure, #edit-disclosure) {
    cursor: pointer;
}

.menu-item:hover,.submenu-item:hover {
    background-color: var(--accent);
}

a {
    /* Using block just to ensure the height is taken */
  display : block;
  width: 100%;
  text-decoration: none;
  color: var(--text);
  transition: 0.4s;
  height: 2rem;
  padding: 3px;
  cursor: pointer;
}

.submenu {
    min-height: 3rem; /* Ensures the submenu doesn't collapse */
    height: auto;
}
</style>