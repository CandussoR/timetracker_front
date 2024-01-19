<template>
    <div id="modal" class="modal">
        <div class="modalContent" v-if="content == 'newTask'"><NewTaskModal/></div>
        <div class="modalContent" v-if="content == 'newTag'"><NewTagModal/></div>
    </div>
</template>

<script setup>
import NewTaskModal from './NewTaskModal.vue';
import NewTagModal from './NewTagModal.vue';

defineProps({
    content : String
})
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: auto;
        max-width: 350px;
        width: 35%;
        height: 45%;
        z-index: 999;
        border-color : #70CFFF;
        border-style: solid;
        border-radius : 5px;
        display : flex;
        flex-direction: column;
        text-align: center;
    }
</style>