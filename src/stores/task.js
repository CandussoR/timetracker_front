import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/apiRequester"

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([])

    /** Gets all the tasks at the creation of the App. */
    async function index() {
        const res = await axios.get('/tasks')
        if (res.status == 200) {
            tasks.value = res.data
        }
    }

    /**
     * Deletes the task associated to the guid from the database.
     * Mutates the list silently.
     * 
     * @param {string} guid 
     */
    function deleteTask(guid) {
        console.log(guid)
        tasks.value = tasks.value.filter((task) => task.guid != guid)
    }

    return {tasks, index, deleteTask}
})