<template>
    <h1>Add an Old Timer</h1>
    <form @submit.prevent="handleSubmit">
        <div class="time-record-form">

            <fieldset>
                <label class="bold" for="time-record-date">Date : </label>
                <VueDatePicker id="time-record-date" 
                    name="time-record-date"
                    v-model="formRecord.date" 
                    :maxDate="new Date()" 
                    locale="fr" 
                    :model-value="formRecord.date" 
                    model-type="yyyy-MM-dd" 
                    format='yyyy-MM-dd' 
                    auto-apply 
                    :enable-time-picker="false"
                    placeholder="Select a date"/>
            </fieldset>

            <fieldset>
                <TaskSelect @selected="formRecord.task_name = $event"/>
                <SubtaskSelect :task="formRecord.task_name" @selected="formRecord.subtask = $event"/>
            </fieldset>


            <fieldset>
                <TagSelect @selected="formRecord.tag = $event"/>
            </fieldset>
            
            <fieldset>
                <label class="bold" for="time-record-beginning">Time Beginning : </label>
                <VueDatePicker id="time-record-beginning" 
                                name="time-record-beginning"
                                v-model="formRecord.timeBeginning"
                                :model-value="formRecord.timeBeginning"
                                model-type="HH:mm:ss" 
                                format= "HH:mm:ss"
                                time-picker
                                enable-seconds
                                />
                <label class="bold" for="time-record-ending">Time Ending :</label>
                <VueDatePicker id="time-record-ending"
                                name="time-record-ending"
                                v-model="formRecord.timeEnding"
                                :model-value="formRecord.timeEnding"
                                model-type="HH:mm:ss" 
                                format= "HH:mm:ss"
                                time-picker
                                enable-seconds
                                />
            </fieldset>
            
            <fieldset>
                <label class="bold" for="log">Log :</label> 
                <textarea id="log" name="log" v-model="formRecord.log"/>
            </fieldset>
        </div> 
        <div class="form-button">
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';

const formRecord = ref({
    date : null,
    task_name : null,
    subtask : null,
    tag : null,
    timeBeginning : 
        {
            hours: null,
            minutes: null,
            seconds: null
        },
    timeEnding : 
        {
            hours: null,
            minutes: null,
            seconds: null
        },
    log: null
})

</script>

<style scoped>
#log {
    display: flex;
}
button {
    margin : auto 0;
}
</style>