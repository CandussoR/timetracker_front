import { defineStore } from "pinia"
import { ref, computed } from "vue"
import axios from "../utils/apiRequester"

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([])
    /** @type {Array<String>} */
    const uniqueTasks = computed(() => new Set(tasks.value.map(x => x.task_name)))
    const createdTask = ref(null)
    const createdSubtask = ref(null)
    const isCreated = ref(false)


    /** Gets all the tasks from the API and set the tasks and uniqueTasks value. */
    async function index() {
        if (tasks.value.length == 0 ) {
            const res = await axios.get('/tasks')
            tasks.value = res.data
        }
    }

   /**
    * Sends a request to create a new Task to the database,
    * and update createdTask and createdSubtask to make them available in TimerFormView.
    * 
    * @param {string} taskName 
    * @param {string} subtask 
    */ 
    async function createTask(taskName, subtask) {
        isCreated.value = false
        const data = subtask == null ? {task_name: taskName} : {task_name : taskName, subtask: subtask}
        const res = await axios.post('/task', data)

        if (res.status == 200) {
            createdTask.value = res.data["task_name"]
            createdSubtask.value = res.data["subtask"]
            tasks.value.push(res.data)
            isCreated.value = true
            return res.status
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

    return {tasks, uniqueTasks, createdTask, createdSubtask, isCreated, index, createTask, deleteTask, filterSubtask}
})