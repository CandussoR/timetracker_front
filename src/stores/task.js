import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "../utils/apiRequester"

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([])
    /** @type {Array<String>} */
    const uniqueTasks = ref([])

    /** Gets all the tasks from the API and set the tasks and uniqueTasks value. */
    async function index() {
        if (tasks.value.length == 0 ) {
            const res = await axios.get('/tasks')
            tasks.value = res.data
            uniqueTasks.value = new Set(tasks.value.map(x => x.task_name))
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

    /**
     * Returns an array of the possible subtasks associated to this task name
     * 
     * @param {string} task_name 
     * @returns {Array<String>}
     */
    function filterSubtask(task_name) {
        const task_items = tasks.value.filter((task) => (task.task_name == task_name) && task.subtask )
        return task_items.map(t => t.subtask)
    }

    return {tasks, uniqueTasks, index, deleteTask, filterSubtask}
})