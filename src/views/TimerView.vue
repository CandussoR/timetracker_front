<template>
    <main id="clock">
        <h1>{{timeRecordStore.displayOngoingInfos.clock || 'Timer'}}</h1>

        <div id="record__info" v-if="timeRecordStore.displayOngoingInfos">
            <p id="record__info-task" class="task" v-if="timeRecordStore.displayOngoingInfos.task_name">{{timeRecordStore.displayOngoingInfos.task_name}}
                <span id="record__info-subtask" v-if="timeRecordStore.displayOngoingInfos.subtask">({{timeRecordStore.displayOngoingInfos.subtask}})</span>
            </p>
            <p id="record__info-tag" class="tag" v-if="timeRecordStore.displayOngoingInfos.tag">{{timeRecordStore.displayOngoingInfos.tag}}</p>
        </div>

        <TimerComponent />
    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTimeRecordStore } from '../stores/timeRecord.js';
import { useRouter } from 'vue-router';
import TimerComponent from '@/components/TimerComponent.vue';

const timeRecordStore = useTimeRecordStore()
const router = useRouter()

onMounted(() => {
    if (!timeRecordStore.displayOngoingInfos) {
        router.push('/new');
    } else {
        console.log("timeRecordStore")
    }
})

</script>

<style scoped>
main {
    display : flex;
    flex-direction : column;
    place-items : center;
}



@media screen and (max-height : 300px) {
    h1, p.task {
        display : none;
    }
}
@media screen and (max-height : 500px) {
    p.task {
        margin : .5rem auto;
    }
}
</style>