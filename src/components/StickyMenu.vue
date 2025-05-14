    <template>
    <aside id="menu">
        <div id="menu" :class="[isExpanded ? 'menu is-expanded' : 'menu']">
            <div id="menu-wrap" class="menu-toggle">
                <button id="wrap" type="button" class="wrap" @click="isExpanded ? closeMenu(true) : expandMenu()">
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
                    <span class="material-symbols-outlined svg">timer</span>
                    <p class="primary" v-show="isExpanded">New clock</p>
                </div>
            </router-link>
            <router-link to="/old">
                <div class="menu-item" :class="{ active: route.path === '/old' }">
                    <span class="material-symbols-outlined svg">alarm_add</span>
                    <p class="primary" v-show="isExpanded">Add Old Timer</p>
                </div>
            </router-link>
            <router-link to="/time_records">
                <div class="menu-item" :class="{ active: route.path === '/time_records' }">
                    <span class="material-symbols-outlined svg">search</span>
                    <p class="primary" v-show="isExpanded">New search</p>
                </div>
            </router-link>
            <div id="edit-menu" class="composed">
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

        <div id="stats-menu" class="composed">
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
        <router-link to="/settings">
                <div class="menu-item" :class="{ active: route.path === '/settings' }">
                    <span class="material-symbols-outlined svg">settings</span>
                    <p class="primary" v-show="isExpanded">Settings</p>
                </div>
            </router-link>
        </div>
    </aside>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['expand', 'close'])
const props = defineProps(['closeMenu'])
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

watch(() => props.closeMenu, (newValue) => {
    if (newValue) {
        closeMenu(false);
    }
});

router.beforeEach(() => {
    emit('close')
})

// Unmounts expand button from dom if width < 480 (portable)
const windowWidth = ref(window.innerWidth)
onMounted(() => addEventListener('resize', handleResize))
function handleResize() {
    windowWidth.value = window.innerWidth
}

function expandMenu() {
    isExpanded.value = true
    emit('expand')
}

function closeMenu(must_emit) {
    isExpanded.value = false
    editSubmenu.value = false
    statSubmenu.value = false
    if (must_emit) {
        emit('close') 
    }
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
</script>

<style scoped>
#menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 99;
}

.menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: var(--background);
    width: max-content;
    z-index: 99;
    overflow: auto;
    scroll-snap-type: y mandatory;
    scroll-snap-align: start end;
    /* Hiding scrollbar for Firefox and Edge */
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Hiding scrollbar for Chrome, Safari, Opera */
.menu::-webkit-scrollbar {
    display: none;
}

.menu-item {
    display: flex;
    flex-grow: 1;
    align-items: center;
    margin-bottom: 1%;
}

.composed {
    padding: 3px;
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
.submenu-item:hover {
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
    justify-content: center;
    /* Center horizontally */
    align-items: center;
    /* Center vertically */
    width: 3rem;
    height: 3rem;
}

p {
    width: calc(80% - 2%);
    /* width without the padding of the p to not deform the svg */
}

/* Submenu */
.submenu {
    display: flex;
    flex-direction: column;
}

.submenu-item {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-weight: 500;
    width: 75%;
    padding: 0;
    margin: 0;
    margin-left: auto;
    border-radius: 0.3em;
}

@media screen and (min-width: 764px) {
    /* Whether expand, or unroll, or burger, make it smaller ? */
    span:first {
        width: 2rem;
        height: 2rem;
    }

    /* Styling the expand arrow */
    .menu-toggle {
        display: flex;
        justify-content: flex-end;
    }

    .wrap {
        background-color: var(--expanded);
        color: var(--text);
        border-style: none;
    }

    .is-expanded .wrap {
        transform: rotate(-180deg);
        /* points inward when expanded */
    }
}
</style>