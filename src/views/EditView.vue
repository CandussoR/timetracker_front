<template>
    <main>
        <h1>Edit</h1>
        <h2>Task & Tags</h2>

        <form @change.prevent="handleSelected">
            <select name="action">
                <option value='Modify' selected default>Modify</option>
                <option value='Delete'>Delete</option>
            </select>
            <select name="field">
                <option value="" default disabled>--</option>
                <option value="Task">Task</option>
                <option value="Tags">Tags</option>
            </select>
        </form>

        <div class="section-inputs" v-if="formData.field === 'Task'">
            <TaskSelect :task="task" @selected="task = $event" />
            <SubtaskSelect :task="task" view="edit" @selected="subtask = $event" />
        </div>
        <div class="section-inputs" v-else>
            <TagSelect :tag="tag"></TagSelect>
        </div>

        <div v-if="!canDelete">
            <p>This item is used by some records. {{ formData.field === 'Task' ? 'It cannot be deleted before setting another task for the records.' : '' }}</p>
        </div>

        <button v-if="formData.old_guid && formData.new_guid" @click="send">Send</button>
        <ConfirmDeleteModal v-if="displayModal"></ConfirmDeleteModal>

        <p class="success" v-if="success">{{fieldPh}} successfully deleted.</p>
        <div v-else>
            <p class="" v-if="formData.field === 'Task'">The {{fieldPh}} is used.</p>
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
const displayModal = ref(false);
const formData = ref({ action : 'Modify', field : null, old_guid : null, new_guid : null });
const success = ref(null);
const updateSuccess = ref(null);

const fieldPh = computed(() => {
    if (formData.value.field) return null;
    return formData.value.field === 'Tags' ? 'Tag' : 'Task' 
})
const retrievedGuid = computed(() => {
    if (formData.value.field === 'Tags') {
        return tagStore.tags.filter((tag) => tag.name === tag.value) .map((task) => task.guid)[0] ;
    }

    if (!(task.value && subtask.value)) {
        return taskStore.tasks.filter((task) => task.task_name == task.value && task.subtask == subtask.value)
            .map((task) => task.guid)[0];
    }

    return null;
})
const isUsed = computed(() => retrievedGuid.value && formData.value.field === 'Tags' ? tagStore.isTagUsed(retrievedGuid.value) : taskStore.isTaskUsed(retrievedGuid.value));
const canDelete = computed(() => isUsed.value ? false : true)

function handleSelected(event) {
    if (event.target.name === "action" && !formData.value.field) {
        return;
    }
    
    event.target.name === 'action' ? formData.value.action = event.target.value : formData.value.field = event.target.value;
}

function closeModal() {
  displayModal.value = false
}

async function handleUpdate() {
    try {
        let res = null;
        if (formData.value.field === 'Tags') {
            // TODO : create
            res = await tagStore.updateAll(formData.value.old_guid, formData.value.new_guid);
        } else {
            // TODO : create
            res = await taskStore.updateAll(formData.value.old_guid, formData.value.new_guid);
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

    if (formData.value.field === 'Tags') {
        tagStore.deleteTag(retrievedGuid.value)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    } else {
        taskStore.deleteTask(retrievedGuid.value)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    }

    canDelete.value = null;
}


function send() {
   if (formData.field.value === 'Delete' && canDelete.value) {
    handleDelete('confirm');
    return;
   } 

   handleUpdate();
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