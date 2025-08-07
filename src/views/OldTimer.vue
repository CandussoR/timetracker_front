<template>
    <main id="old-time">
        <h1>Catch Up</h1>
        <div class="form-container">
            <form v-if="!record" @submit.prevent="handleSubmit">
            <div class="time-record-form">
    
                <fieldset id="date__section">
                    <legend>Date 
                        <sup aria-labelledby="Required" title="Required" class="error">*</sup>
                    </legend>
                    <label class="sr-only" for="time-record-date">Date : </label>
                    <VueDatePicker id="time-record-date" 
                        name="time-record-date"
                        v-model="date" 
                        :maxDate="maxDate" 
                        :model-value="date" 
                        model-type="yyyy-MM-dd" 
                        format='yyyy-MM-dd' 
                        auto-apply 
                        prevent-min-max-navigation
                        :enable-time-picker="false"
                        placeholder="Select a date"
                        :locale="lang"
                        required/>
                </fieldset>
    
                <fieldset id="task__section">
                    <legend>Task <sup aria-labelledby="Required" title="Required" class="error">*</sup>
                        <!-- Using click.stop to prevent propagation of closeModal -->
                        <span id="add-task-button" class="material-symbols-outlined" v-if="!newTask" @click.stop="newTask = !newTask">add</span> 
                    </legend>
                    <div class="section-inputs">
                        <TaskSelect :task="selectedTask" @selected="selectedTask = $event"/>
                        <SubtaskSelect v-if="selectedTask" :task="selectedTask" view="timerForm" @selected="selectedSubtask = $event" :key="selectedTask"/> 
                    </div>
                </fieldset>
    
    
                <fieldset id="tag__section">
                    <legend>Tag
                        <span class="material-symbols-outlined" v-if="!newTag" @click.stop="newTag = !newTag">add</span>
                    </legend>
                    <TagSelect :tag="selectedTag" @selected="selectedTag" :key="selectedTag"/>
                </fieldset>
                
                <fieldset id="time__section">
                    <legend>Time</legend>
                    <div class="section-inputs">
                        <div id="time-beginning">
                            <label class="bold" for="time-record-beginning">Beginning
                                <sup aria-labelledby="Required" title="Required" class="error">*</sup> :
                            </label>
                            <div class="datepicker">
                                <VueDatePicker id="time-record-beginning" 
                                                name="time-record-beginning"
                                                v-model="timeBeginning"
                                                :model-value="timeBeginning"
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
                            <label class="bold" for="time-record-ending">Ending
                                <sup aria-labelledby="Required" title="Required" class="error">*</sup> :
                            </label>
                            <div class="datepicker">
                                <VueDatePicker id="time-record-ending"
                                                name="time-record-ending"
                                                v-model="timeEnding"
                                                :model-value="timeEnding"
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
                    <label class="sr-only" for="log">Log :</label> 
                    <textarea id="log" name="log" v-model="log" rows="10" cols="70" placeholder="Write something, if you want."></textarea>
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
import { computed, ref, watch, onMounted } from 'vue';
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
import { locale } from '@tauri-apps/plugin-os';

const lang = ref(localStorage.getItem('lang'))
const newTag = ref(false)
const newTask = ref(false)
const recordStore = useTimeRecordStore()
const taskStore = useTaskStore()
const tagStore = useTagStore()
const statStore = useStatStore()
const record = ref(null)
const errorMsg = ref('')
const success = ref(false)

const maxDate = new Date()

// Form fields
const date = ref(null)
const selectedTag = ref(null)
const selectedTask = ref(null)
const selectedSubtask = ref(null)
const timeBeginning = ref("00:00:00")
const timeEnding = ref("00:00:00")
const log = ref(null)

const isDisabled = computed(() => !(date.value && selectedTask.value && (timeBeginning.value != timeEnding.value)));

onMounted(async () => {
    if (!lang.value) {
        const loc = await locale();
        localStorage.setItem('lang', loc)
        lang.value = loc
    }
})

watch(
    () => taskStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
    }
    selectedTask.value = taskStore.createdTask;
    selectedSubtask.value = taskStore.createdSubtask;
});

watch(
    () => tagStore.isCreated, 
    (newValue) => {
        if (newValue === true) {
            closeModal()
    }
    selectedTag.value = tagStore.createdTag;
});

async function handleSubmit() {
    try {
        const formRecord = {
            "date" : date.value,
            "time_beginning" : timeBeginning.value,
            "time_ending" : timeEnding.value,
            "log": log.value
        }

        formRecord["task_guid"] = taskStore.tasks.filter(x => x.task_name == selectedTask.value
                                                                && x.subtask == selectedSubtask.value)
                                                    .map(x => x.guid)[0]
        if (selectedTag.value) {
            formRecord["tag_guid"] = tagStore.tags.filter(x => x.tag === selectedTag.value).map(x => x.guid)[0]
        }

        const res = await recordStore.createTimeRecord(formRecord, "old")
        if (res) {
            success.value = true
            record.value = res
            statStore.handleUpdated();
            setDefaultForm()
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

function setDefaultForm() {
    selectedTag.value = null
    selectedTask.value = null
    selectedSubtask.value = null
    timeBeginning.value = "00:00:00"
    timeEnding.value = "00:00:00"
    log.value = null
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

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
</style>