<template>
    <h1>Settings</h1>
    <div v-if="database && ring">
        <p><span>Database : </span>{{database}}
            <span class="material-symbols-outlined" @click="select">edit</span>
            <span class="material-symbols-outlined" @click="move"> drive_file_move </span>
        </p>
        <p><span>Timer ring : </span>{{ring}}<span class="material-symbols-outlined"
                @click="select">edit</span></p>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "../utils/apiRequester";
import { open } from '@tauri-apps/plugin-dialog';
const database = ref(null)
const ring = ref(null)
const edit = ref(null)

onMounted(async () => {
    const res = await axios.get('/settings')
    if (res.status == 200) {
        database.value = res.data.database;
        ring.value = res.data.timer_ring;
    } else {
        error.value = res.data.message
    }
})

async function select() {
    const select = await open({multiple: false, directory: false})
    console.log(select)
}

async function move() {
    const move = await open({ multiple:false, directory:true })
    console.log(move)
}
</script>

<style scoped>

</style>