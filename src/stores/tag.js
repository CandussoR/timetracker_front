import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useTagStore = defineStore('tags', () => {
    const tags = ref([])
    const isCreated = ref(false)
    const createdTag = ref(null)

    function reset() {
        tags.value = []
        isCreated.value = false
        createdTag.value = null
    }

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
        try {
            const res = await axios.post('/tag', { "tag": tag })
            if (res.status == 200) {
                createdTag.value = res.data.tag
                tags.value.push(res.data)
                isCreated.value = true
            }
            return res
        } catch (e) {
            return e.response
        }
    }

    /**
     * Deletes the tag associated to the guid from the database.
     * Throws a 400 if the tag can't be deleted because used for a timer,
     * and a 500 if any other problem occured.
     * Mutates the list silently.
     * 
     * @param {string} guid 
     */
    async function deleteTag(guid) {
        const res = await axios.delete(`/tag/${guid}`)
        if (res.status == 200) {
            tags.value = tags.value.filter((tag) => tag.guid != guid)
        } else if (res.status == 400) {
            return 400, res.data
        } else {
            return 500, "An error occured."
        }
    }

    async function isTagUsed(guid) {
        const res = await axios.get(`/tag/used/${guid}`);
        if (res.status === 200) {
            return 200, res.data.isUsed;
        } else if ([400, 404].includes(res.status)) {
            return 400, res.data;
        } else {
            return 500, "An error occured.";
        }
    }

    async function modify(guid, new_value) {
        const res = await axios.put(`/tag/${guid}`, {new_value : new_value});
        if (res.status === 200) {
            tags.value.find(t => t.guid === guid).name = new_value;
        } else if ([400, 404].includes(res.status)) {
            return 400, res.data;
        } else {
            return 500, "An error occured.";
        }
    }

   return {tags, createdTag, isCreated, index, createTag, deleteTag, reset, isTagUsed, modify}
})