import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useTagStore = defineStore('tags', () => {
    const tags = ref([])

    /** Gets all the tags from the back */
    async function index() {
        if (tags.value.length == 0) {
            const res = await axios.get('/tags')
            tags.value = res.data
        }
    }

    return {tags, index}
})