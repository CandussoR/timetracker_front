<template>
    <main>
        <h1>Edit</h1>

        <form>
            <select @change="handleSelected">
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
            <button @click="confirmDelete = true">Delete</button>
        </div>

        <ConfirmDeleteModal v-if="confirmDelete"></ConfirmDeleteModal>
    </main>
</template>

<script setup>
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { ref, provide } from 'vue';

const editedField = ref("");
const task = ref(null);
const subtask = ref(null);
const confirmDelete = ref(false);
const modify = ref(false);
const taskStore = useTaskStore();
const tagStore = useTagStore();

function handleSelected(event) {
    if (event.target.value == editedField.value) return ;

    editedField.value = event.target.value;
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