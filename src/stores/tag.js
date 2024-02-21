import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useTagStore = defineStore('tags', () => {
    const tags = ref([])
    const isCreated = ref(false)
    const createdTag = ref(null)

    /** Gets all the tags from the back */
    async function index() {
        if (tags.value.length == 0) {
            const res = await axios.get('/tags')
            tags.value = res.data
        }
    }

    /**
     * Gets a form input and updates the values
     * 
     * @param {string} tag 
     * @returns {number} the status code of the request 
     */
    async function createTag(tag) {
        const res = await axios.post('/tag', {"tag" : tag})
        if (res.status == 200) {
            createdTag.value = res.data
            tags.value.push(res.data)
            isCreated.value = true
        }
        return res.status
    }

    return {tags, createdTag, isCreated, index, createTag}
})