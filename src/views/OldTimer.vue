<template>
    <main id="old-time">
        <h1>Add an Old Timer</h1>
        <div class="form-container">
            <form v-if="!record" @submit.prevent="handleSubmit">
            <div class="time-record-form">
    
                <fieldset id="date__section">
                    <legend>Date</legend>
                    <label class="bold" for="time-record-date" hidden>Date : </label>
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
                        placeholder="Select a date"
                        required/>
                </fieldset>
    
                <fieldset id="task__section">
                    <legend>Task
                        <!-- Using click.stop to prevent propagation of closeModal -->
                        <span id="add-task-button" class="material-symbols-outlined" v-if="!newTask" @click.stop="newTask = !newTask">add</span> 
                    </legend>
                    <div class="section-inputs">
                        <TaskSelect @selected="formRecord.task_name = $event"/>
                        <SubtaskSelect :task="formRecord.task_name" view="timerForm" @selected="formRecord.subtask = $event"/>
                    </div>
                </fieldset>
    
    
                <fieldset id="tag__section">
                    <legend>Tag
                        <span class="material-symbols-outlined" v-if="!newTag" @click="newTag = !newTag">add</span>
                    </legend>
                    <TagSelect @selected="formRecord.tag = $event"/>
                </fieldset>
                
                <fieldset id="time__section">
                    <legend>Time</legend>
                    <div class="section-inputs">
                        <div id="time-beginning">
                            <label class="bold" for="time-record-beginning">Time Beginning : </label>
                            <div class="datepicker">
                                <VueDatePicker id="time-record-beginning" 
                                                name="time-record-beginning"
                                                v-model="formRecord.timeBeginning"
                                                :model-value="formRecord.timeBeginning"
                                                model-type="HH:mm:ss" 
                                                format= "HH:mm:ss"
                                                time-picker
                                                enable-seconds
                                                text-input
                                                required
                                                />
                            </div>
                        </div>
                        <div id="time-ending">
                            <label class="bold" for="time-record-ending">Time Ending :</label>
                            <div class="datepicker">
                                <VueDatePicker id="time-record-ending"
                                                name="time-record-ending"
                                                v-model="formRecord.timeEnding"
                                                :model-value="formRecord.timeEnding"
                                                model-type="HH:mm:ss" 
                                                format= "HH:mm:ss"
                                                time-picker
                                                enable-seconds
                                                text-input
                                                required
                                                />
                            </div>
                        </div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Log</legend>
                    <label class="bold" for="log">Log :</label> 
                    <textarea id="log" name="log" v-model="formRecord.log" rows="10" cols="70" placeholder="Write something, if you want."></textarea>
                </fieldset>
            </div> 
            <div id="submit">
                <button class="button" type="submit" :disabled="isDisabled">Submit</button>
            </div>
        </form>
    
        </div>
        
        <div class="record-display" v-if="record">
            <div>
                <TimeRecordCard :record="record" @updated="record = $event"/>
            </div>
        
            <div id="another" v-if="success">
                <button class="button" @click="handleAnother">Create another timer</button>
            </div>
        </div>
    
        <Overlay v-if="newTask || newTag" @click="closeModal"/>
        <ModalFrame content="newTask" v-if="newTask"/>
        <ModalFrame content="newTag" v-if="newTag"/>
    </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import Overlay from '@/components/Overlay.vue';
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css';
import TimeRecordCard from '@/components/TimeRecordCard.vue';
import TaskSelect from '@/components/select/TaskSelect.vue';
import SubtaskSelect from '@/components/select/SubtaskSelect.vue';
import TagSelect from '@/components/select/TagSelect.vue';
import { useTimeRecordStore } from '@/stores/timeRecord';
import { useTaskStore } from '@/stores/task';
import { useTagStore } from '@/stores/tag';
import { useStatStore } from '@/stores/stats';

const newTag = ref(false)
const newTask = ref(false)
const recordStore = useTimeRecordStore()
const taskStore = useTaskStore()
const tagStore = useTagStore()
const statStore = useStatStore()
const record = ref(null)
const errorMsg = ref('')
const success = ref(false)
const formRecord = ref(setDefaultForm())
const isDisabled = computed(() => !formRecord.value.date && !formRecord.value.task_name && !(typeof formRecord.value.timeBeginning == 'Object') && !(typeof formRecord.value.timeEnding == 'Object'));


watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
    }
});

watch(
    () => tagStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
    }
});

function setDefaultForm() {
    return {
        date : null,
        task_name : null,
        subtask : null,
        tag : null,
        timeBeginning : 
            {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
        timeEnding : 
            {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
        log: null
    }
}

async function handleSubmit() {
    try {
        if (formRecord.value.subtask !== '') formRecord.value.subtask = null
        formRecord.value.task_guid = taskStore.tasks.filter(x => x.task_name == formRecord.value.task_name 
                                                                && x.subtask == formRecord.value.subtask)
                                                    .map(x => x.guid)[0]
        if (formRecord.value.tag === null) {
            formRecord.value.tag_guid = null
        } else {
            formRecord.value.tag_guid = tagStore.tags.filter(x => x.tag === formRecord.value.tag)
            .map(x => x.guid)[0]
        }
        const res = await recordStore.createTimeRecord(formRecord.value, "old")
        if (res) {
            success.value = true
            record.value = res
            statStore.handleUpdated();
            formRecord.value = setDefaultForm()
        }
    }
    catch(e) {
        errorMsg.value = e
    }
}

function handleAnother() {
    success.value = false
    record.value = null
    errorMsg.value = ''
}

function closeModal() {
    newTask.value = false;
    newTag.value = false;
}

</script>

<style scoped>
#submit {
    align-self: center;
}

.record-display {
    margin: auto;
    width: 80%;
}

#another {
    display: flex;
    margin:auto;
}
</style>