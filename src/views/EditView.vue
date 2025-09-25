<template>
    <main>
        <h1>Edit</h1>

        <form @change.prevent="handleForm">
            <select name="tamere">
                <option value='Modify' selected default>Modify</option>
                <option value='Delete'>Delete</option>
            </select>
            <select name="tonpere" @change="handleSelected">
                <option value="">--</option>
                <option value="Task">Task</option>
                <option value="Tags">Tags</option>
            </select>
        </form>

        <div class="section-inputs" v-if="editedField === 'Task'">
            <TaskSelect :task="task" @selected="task = $event" />
            <SubtaskSelect :task="task" view="edit" @selected="subtask = $event" />
        </div>

        <div class="section-inputs" v-if="editedField === 'Tags'">
            <TagSelect></TagSelect>
        </div>

        <div class="row">
            <button @click="modify = !modify">Modify</button>
            <button @click="checkIfUsed" :disabled="!canDelete & editedField === 'Task'">Delete</button>
        </div>

        <div v-if="!canDelete">
            <p>This item is used by some records. {{ editedField === 'Task' ? 'It cannot be deleted before setting another task for the records.' : '' }}</p>
            <div v-if="editedField === 'Tags'">
                <button v-if="editedField === 'Tags'" @click="handleDeleteChoice('confirm')">Delete</button>
                <button v-else>Modify</button>
            </div>
        </div>

        <ConfirmDeleteModal v-if="displayModal"></ConfirmDeleteModal>

        <p class="success" v-if="success">{{fieldPh}} successfully deleted.</p>
        <div v-else>
            <p class="" v-if="editedField === 'Task'">The {{fieldPh}} is used.</p>
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

const editedField = ref("");
const task = ref(null);
const subtask = ref(null);
const displayModal = ref(false);
const modify = ref(false);
const canDelete = ref(null);
const taskStore = useTaskStore();
const tagStore = useTagStore();
const fieldPh = computed(() => { editedField.value === 'Tags' ? 'Tag' : 'Task'})

function handleSelected(event) {
    if (event.target.value == editedField.value) return ;

    editedField.value = event.target.value;
}

function handleForm(event) {
    console.log(event.elements);
}

function closeModal() {
  displayModal.value = false
}

async function checkIfUsed() {
    const isUsed = editedField === 'Tasks' ? taskStore.taskIsUsed() : tagStore.tagIsUsed();
    if (!isUsed) {
        canDelete.value = true;
        displayModal.value = true;
        return;
    } else {
        canDelete.value = false;
    }
}

async function handleDeleteChoice(choice) {
    if (choice === 'canceled') {
        closeModal()
        return;
    }

    if (selectedField.value === 'Tags') {
        tagStore.deleteTag(guidToDelete.value)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    } else {
        taskStore.deleteTask(guidToDelete.value)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    }

    canDelete.value = null;
}

provide('confirmDelete', handleDeleteChoice)
</script>

<style scoped>
form {
    width: 100%;
    display: flex;
    direction: flex-row;
    justify-content: space-between;
}
</style>