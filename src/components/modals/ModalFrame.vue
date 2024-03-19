<template>
    <div id="modal" class="modal">
        <div class="modalContent" v-if="content == 'newTask'"><NewTaskModal/></div>
        <div class="modalContent" v-else-if="content == 'newTag'"><NewTagModal/></div>
        <div class="modalContent" v-else-if="content == 'confirmDelete'" @confirm="$emit('confirm')" @cancel="$emit('cancel')"><ConfirmDeleteModal/></div>
    </div>
</template>

<script setup>
import NewTaskModal from './NewTaskModal.vue';
import NewTagModal from './NewTagModal.vue';
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

defineProps({
    content : String
})
</script>
