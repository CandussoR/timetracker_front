<template>
    <main>
        <h1>Edit</h1>
        <h2>Task & Tags</h2>

        <form @change.prevent="field = $event.target.value">
            <select name="field">
                <option value="" default selected disabled>--</option>
                <option value="Task">Task</option>
                <option value="Tag">Tag</option>
            </select>
        </form>

        <div v-if="field && !action">
            <div class="section-inputs" v-if="field === 'Task'">
                <TaskSelect :task="task" @selected="task = $event" />
                <SubtaskSelect :task="task" view="edit" @selected="subtask = $event" />
            </div>
            <div class="section-inputs" v-else>
                <TagSelect :tag="tag"></TagSelect>
            </div>
        </div>

        <div v-if="initGuid">
            <button @click="action = 'Modify'">Modify</button>
            <button @click="action = 'Repurpose'">Repurpose</button>
            <button v-if="canDelete || tag">Delete</button>
        </div>


        <div v-if="initGuid && (!canDelete || action !== 'Delete')">
            <div v-if="field === 'Task'">
                <div v-if="action === 'Repurpose'">
                    <TaskSelect :task="newTask" @selected="task = $event" />
                    <SubtaskSelect :task="newTask" view="edit" @selected="subtask = $event" />
                </div>
                <div>
                    <TaskSelect :task="newTask" @selected="newTask = $event" />
                    <SubtaskSelect :task="newTask" view="edit" @selected="newSubtask = $event" />
                </div>
            </div>
            <div v-else>
                <div v-if="action === 'Repurpose'">
                    <TagSelect :tag="tag"></TagSelect>
                </div>
                <div>
                    <input type="text">
                </div>
            </div>
        </div>

        <button v-if="validateBeforeSend" @click="send">Send</button>
        <ConfirmDeleteModal v-if="displayModal"></ConfirmDeleteModal>

        <div v-if="updateSuccess">
            <p class="success" v-if="success">{{ fieldPh }} successfully deleted.</p>
            <p class="error" v-else>An error occurred.</p>
        </div>

    </main>
</template>

<script setup>
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { ref, provide, computed } from 'vue';

const taskStore = useTaskStore();
const tagStore = useTagStore();
const tag = ref(null);
const task = ref(null);
const subtask = ref(null);
const newTag = ref(null);
const newTask = ref(null);
const newSubtask = ref(null);
const displayModal = ref(false);
const success = ref(null);
const updateSuccess = ref(null);
const field = ref(null);
const action = ref(null);


const fieldPh = computed(() => {
    if (field.value) return null;
    return field.value === 'Tags' ? 'Tag' : 'Task' 
});

const isUsed = computed(() => {
    if (!initGuid.value) return true;
    return field.value === 'Tags' ? tagStore.isTagUsed(initGuid.value) : taskStore.isTaskUsed(initGuid.value)
});

const canDelete = computed(() => isUsed.value ? false : true);

const initGuid = computed(() => {
    if (action.value !== 'Repurpose') return;

    if (action.value === 'Tags') {
        return tagStore.tags.filter((tag) => tag.name === tag.value).map((tag) => tag.guid)[0];
    }

    if (!(task.value && subtask.value)) {
        return taskStore.tasks.filter((task) => task.task_name == task.value && task.subtask == subtask.value)
            .map((task) => task.guid)[0];
    }
});

const newGuid = computed(() => {
    if (action.value !== 'Repurpose') return;

    if (field.value === 'Tags') {
        return tagStore.tags.filter((tag) => tag.name === newTag.value).map((tag) => tag.guid)[0];
    }

    if (!(newTask.value && newSubtask.value)) {
        return taskSotre.tasks.filter((newTask) => task.task_name == newTask.value && task.subtask == newSubtask.value)
            .map((newTask) => newTask.guid)[0];
    }
})

const newValue = computed(() => {
    if (action.value !== 'Modify') return;
    return field.value == 'Tag' ? newTag.value : {task : newTask.value, subtask : newSubtask.value};
})

function closeModal() {
  displayModal.value = false
}

function validateBeforeSend() {
    if (action.value == 'Repurpose' && initGuid.value && newGuid.value) return true;
    if (action.value == 'Modify' && newValue.value) return true;
    return false;
}

function send() {
   if (action.value === 'Delete' && canDelete.value) {
    handleDelete('confirm');
    return;
   } 

   if (action.value === 'Repurpose') {
        handleRepurpose(initGuid.value, newGuid.value);
        return;
   }

   handleModify(initGuid.value, newValue.value);
}

/**
 * Used to modify the reference to a task-subtask or tag in a record
 **/
async function handleRepurpose(old_guid, new_guid) {
    try {
        let res = null;
        if (field.value === 'Tags') {
            // TODO : create
            res = await tagStore.updateAll(old_guid, new_guid);
        } else {
            // TODO : create
            res = await taskStore.updateAll(old_guid, new_guid);
        }

        if (res.status === 200) {
            updateSuccess.value = true;
        }
    } catch (err) {
        updateSuccess.value = false;
        console.error(err);
    }
}

async function handleDelete(choice) {
    if (choice === 'canceled') {
        closeModal()
        return;
    }

    if (field.value === 'Tags') {
        tagStore.deleteTag(initGuid.value)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    } else {
        taskStore.deleteTask(initGuid.value)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    }

    canDelete.value = null;
}

/**
 * Used when correcting or changing a tag or a task-subtask itself
 * @param {string} old_guid 
 * @param {string | Object} new_value 
 **/
async function handleModify(old_guid, new_value) {
    try {
        let res = null;
        if (field.value === 'Tags') {
            // TODO : create
            res = await tagStore.update({"guid" : old_guid, "tag" : new_value});
        } else {
            // TODO : create
            res = await taskStore.update({"guid" : old_guid, ...new_value});
        }

        if (res.status === 200) {
            updateSuccess.value = true;
        }
    } catch (err) {
        updateSuccess.value = false;
        console.error(err);
    }
}

provide('confirmDelete', handleDelete)
</script>

<style scoped>
form {
    width: 100%;
    display: flex;
    direction: flex-row;
    justify-content: space-between;
}
</style>