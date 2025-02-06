    <template>
    <aside id="menu">
        <div class="menu-overlay" v-if="isExpanded" @click="closeMenu"></div>
        <div id="menu" :class="[isExpanded ? 'menu is-expanded' : 'menu']">
            <div id="menu-wrap" class="menu-toggle">
                <button id="wrap" type="button" class="wrap" @click="isExpanded = !isExpanded">
                    <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                </button>
            </div>
            <router-link to="/">
                <div class="menu-item" :class="{ active: route.path === '/' }">
                    <span class="material-symbols-outlined svg">home</span>
                    <p class="primary" v-show="isExpanded">Home</p>
                </div>
            </router-link>
            <router-link to="/new">
                <div class="menu-item" :class="{ active: route.path === '/new' }">
                    <span class="material-symbols-outlined svg">alarm</span>
                    <p class="primary" v-show="isExpanded">New clock</p>
                </div>
            </router-link>
            <router-link to="/old">
                <div class="menu-item" :class="{ active: route.path === '/old' }">
                    <span class="material-symbols-outlined svg">alarm_add</span>
                    <p class="primary" v-show="isExpanded">Add Record</p>
                </div>
            </router-link>
            <router-link to="/time_records">
                <div class="menu-item" :class="{ active: route.path === '/time_records' }">
                    <span class="material-symbols-outlined svg">search</span>
                    <p class="primary" v-show="isExpanded">New search</p>
                </div>
            </router-link>
            <!-- <div id="edit-menu-container"> -->
            <div id="edit-menu">
                <div id="edit-menu__header" class="menu-item" @click="toggleEditSubmenu"
                    :class="{ active: route.path == '/tasks' || route.path === '/tags' }">
                    <span class="material-symbols-outlined svg">edit</span>
                    <p class="primary" v-show="isExpanded">Edit</p>
                </div>
                <div id="edit-menu__submenu" class="submenu" v-if="editSubmenu">
                    <router-link to="/tasks">
                        <p class="primary submenu-item" :class="{ active: route.path === '/tasks' }">Tasks</p>
                    </router-link>
                    <router-link to="/tags">
                        <p class="primary submenu-item" :class="{ active: route.path === '/tags' }">Tags</p>
                    </router-link>
                </div>
            </div>
        <div id="stats-menu">
            <div id="stats-menu__header" class="menu-item" @click="toggleStatSubmenu"
                :class="{ active: route.path === '/stats' || route.path === '/stats/dive' }">
                <span class="material-symbols-outlined svg">bar_chart</span>
                <p class="primary" v-show="isExpanded">Stats</p>
            </div>
            <div id="edit-menu__submenu" class="submenu" v-if="statSubmenu">
                <router-link to="/stats">
                    <p class="primary submenu-item" :class="{ active: route.path === '/stats' }">Resume</p>
                </router-link>
                <router-link to="/stats/dive">
                    <p class="primary submenu-item" :class="{ active: route.path === '/stats/dive' }">Dive Into</p>
                </router-link>
            </div>
        </div>
        </div>
    </aside>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const editSubmenu = ref(false);
const statSubmenu = ref(false);
const isExpanded = ref(false)

watch(router.currentRoute, () => {
    if (isExpanded.value) isExpanded.value = false;
    if (editSubmenu.value) editSubmenu.value = false;
    if (statSubmenu.value) statSubmenu.value = false;
  });

// Unmounts expand button from dom if width < 480 (portable)
const windowWidth = ref(window.innerWidth)
onMounted(() => addEventListener('resize', handleResize))
function handleResize() {
    windowWidth.value = window.innerWidth
}

function toggleMobileMenu() {
    isExpanded.value = !isExpanded.value
}

function toggleEditSubmenu() {
    if (editSubmenu.value) {
        editSubmenu.value = false 
    } else {
        editSubmenu.value = true
        isExpanded.value = true
    }
}

function toggleStatSubmenu() {
    if (statSubmenu.value) {
        statSubmenu.value = false 
    } else {
        statSubmenu.value = true
        isExpanded.value = true
    }
}

function closeMenu() {
    isExpanded.value = false
    editSubmenu.value = false
    statSubmenu.value = false
}
</script>

<style scoped>
    /* Pasting overlay class here because only case where background not darkened nor blurred */
    .menu-overlay {
        position: fixed;
        top: 0;
        left : 0;
        width: 100vw;
        height: 100vh;
        z-index: 98;
    }

    .menu {
        position: fixed;
        display: flex;
        flex-direction: column;
        width: max-content;
        background-color: var(--background);
        transition: 0.2s ease-out;
        /* Overlay index - 1 */
        z-index: 98;
        height: 100vh;
    }
    .menu-item{
            display: flex; 
            flex-grow: 1;
            align-items: center;
            margin-bottom: 1%;
    }
    .edit-menu-container {
        padding: 3px
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
    .menu-item:hover .svg,
    .submenu-item:hover
    {
        color: var(--text);
        background: var(--accent); 
    }
    .menu-item.active p,
    .menu-item.active .svg,
    .submenu-item.active {
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

    /* Submenu */
    .submenu {
        display: flex;
        flex-direction: column;
    }
    .submenu-item {
        display:flex;
        align-items: flex-end;
        justify-content: center;
        font-weight: 500;
        width: 75%;
        padding: 0;
        margin: 0;
        margin-left:auto;
        border-radius: 0.3em;
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