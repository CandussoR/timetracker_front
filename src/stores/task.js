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


    function reset() {
        tasks.value = []
        createdTask.value = null
        createdSubtask.value = null
        isCreated.value = false
    }


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
        try {
            const res = await axios.post('/task', data)
            if (res.status == 200) {
                createdTask.value = res.data["task_name"]
                createdSubtask.value = res.data["subtask"]
                tasks.value.push(res.data)
                isCreated.value = true
            }
            return res
        } catch (e) {
            console.log("Exception catched", e)
            return e.response
        }

        // if (res.status == 200) {
        //     createdTask.value = res.data["task_name"]
        //     createdSubtask.value = res.data["subtask"]
        //     tasks.value.push(res.data)
        //     isCreated.value = true
        // }
        // return res.status
    }

    /**
     * Deletes the task associated to the guid from the database.
     * Throws a 400 if the task can't be deleted because used for a timer,
     * and a 500 if any other problem occured.
     * Mutates the list silently.
     * 
     * @param {string} guid 
     */
    function deleteTask(guid) {
        const res = axios.delete(`/task/${guid}`)
        if (res.status == 200) {
            tasks.value = tasks.value.filter((task) => task.guid != guid)
        } else if (res.status == 400) {
            return 400, res.data
        } else {
            return 500, "An error occured."
        }
    }

    return {tasks, uniqueTasks, createdTask, createdSubtask, isCreated, index, createTask, deleteTask, reset}
})