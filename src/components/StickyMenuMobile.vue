<template>
    <aside id="menu">
        <button id="menu-button" type="button" class="menu-button" @click="toggleMobileMenu()">
            <span class="material-symbols-outlined">menu</span>
            Mobile Menu
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
                            Home
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

                <li>
                    <details id="edit-menu-container">
                        <summary id="disclosure-edit" @click="toggleEditSubmenu"
                            :class="{ active: route.path == '/tasks' || route.path === '/tags' }">
                            <span class="material-symbols-outlined">edit</span>
                            Edit
                        </summary>
                        <ul id="edit-submenu" v-if="editSubmenu">
                            <li>
                                <router-link to="/tasks">
                                    <p :class="{ active: route.path === '/tasks' }">Tasks</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/tags">
                                    <p :class="{ active: route.path === '/tags' }">Tags</p>
                                </router-link>
                            </li>
                        </ul>
                    </details>
                </li>

                <li id="stats-menu">
                    <details>
                        <summary id="stats-disclosure" class="menu-item" @click="toggleStatSubmenu"
                            :class="{ active: route.path === '/stats' || route.path === '/stats/dive' }">
                            <span class="material-symbols-outlined ">bar_chart</span>
                            Stats
                        </summary>
                        <ul id="stats-submenu" v-if="statSubmenu">
                            <li>
                                <router-link to="/stats">
                                    <p :class="{ active: route.path === '/stats' }">Resume</p>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/stats/dive">
                                    <p :class="{ active: route.path === '/stats/dive' }">Dive Into
                                    </p>
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isToggled = ref(false)

const editSubmenu =ref(true)
const statSubmenu = ref(true)

function toggleMobileMenu() {
    if (isToggled.value) {
        isToggled.value = false
    } else {
        isToggled.value = true
    }
    console.log(isToggled.value)
}

function toggleEditSubmenu() {
    editSubmenu.value = !editSubmenu.value
}
function toggleStatSubmenu() {
    statSubmenu.value = !statSubmenu.value
}
</script>

<style>
li {
    list-style: none;
}
:root {
    --level: .5rem;
}

.overlay {
    position: fixed;
    top: 0;
    left : 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    /* backdrop-filter: blur(2px); */
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
    background-color: var(--background);
    height: 100vh;
    width: fit-content;
    line-height: 1.25rem;
    backdrop-filter: blur(10px);
    /* Hiding scrollbar for Firefox and Edge */
    -ms-overflow-style: none;
    scrollbar-width: none;
}
/* Hiding scrollbar for Chrome, Safari, Opera */
.menu::-webkit-scrollbar {
    display: none;
}


details {
    padding: 1rem 0;  
}
/* Hiding arrows */
details > summary {
    list-style: none;
}

.menu-item, summary {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-content: center;
    margin-right: 2rem;
}
.menu-item:not(#stats-menu__header, #edit-menu__header) {
    cursor: pointer;
}
/*
.submenu-item {
        display:flex;
        align-items: flex-end;
        justify-content: center;
        font-weight: 500;
        width:fit-content;
        
        padding: calc(var(--level)*4);
        margin: 0;
        border-radius: 0.3em;
    }

.menu-item:hover,.submenu-item:hover {
    background-color: var(--accent);
}
*/
a {
  text-decoration: none;
  color: var(--text);
  transition: 0.4s;
  padding: 3px;
  cursor: pointer;
}
a:hover {
    margin: 1px 1px;
}

</style>