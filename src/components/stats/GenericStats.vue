<template>
    <div>
        <div id="cards-row" class="cards-row">
          <TimerCountCard v-if="resume.count && resume.time" :count="resume.count" :time="resume.time" />
          <MeanTimeCard v-if="resume.mean" :mean="resume.mean" :selected="props.selector" />
        </div>

        <div id="resume" v-if="!resume.count || (resume.time === 0)">
          <p id="incite" class="incite">No timer yet ! Let's do one</p>
          <button @click="redirect" class="button primary">New timer</button>
        </div>

        <CustomBar :data="statStore.taskRatio" />

        <TaskRatioList :data="statStore.taskRatio" />

        <div id="details" class="details" v-if="props.selected !== 'D' && !showDetails" @click="loadMore()">
          More details !<span class="material-symbols-outlined">arrow_drop_down</span>
        </div>

        <div id="generic-stat" class="generic-stat" v-if="showDetails">
          <div v-if="props.selected === 'W'" id="chart">
            <label class="chart-title" for="line-chart__day">Time per day</label>
            <ApexLineChart :id="'line-chart__day'" :options="daysLineChart['options']" :series="daysLineChart['series']"
              :title="daysLineChart['title']" />
            <label class="chart-title" for="bar-chart__day">Time per task per day</label>
            <ApexBarChart :id="'bar-chart__day'" :options="weekTaskRatio['options']" :series="weekTaskRatio['series']"
              :title="weekTaskRatio['title']" />
          </div>
          <div v-else-if="props.selected === 'M'" id="chart">
            <label class="chart-title" for="line-chart__week">Time per week</label>
            <ApexLineChart :id="'line-chart__week'" :options="weeksLineChart['options']"
              :series="weeksLineChart['series']" :title="weeksLineChart['title']" />
            <label class="chart-title" for="bar-chart__week">Time per task per week</label>
            <ApexBarChart :id="'bar-chart__week'" :options="monthTaskRatio['options']"
              :series="monthTaskRatio['series']" :title="monthTaskRatio['title']" />
          </div>
          <div v-else-if="props.selected === 'Y'" id="chart">
            <label class="chart-title" for="line-chart__month">Time per month</label>
            <ApexLineChart :id="'line-chart__month'" :options="monthsLineChart['options']"
              :series="monthsLineChart['series']" :title="monthsLineChart['title']" />
            <label class="chart-title" for="bar-chart__month">Time per task in month</label>
            <ApexBarChart :id="'bar-chart__month'" :options="yearTaskRatio['options']" :series="yearTaskRatio['series']"
              :title="yearTaskRatio['title']" />
            <label class="chart-title" for="bar-chart__week">Time per week</label>
            <apexchart id="bar-chart__week" type="bar" height="450" :options="weekBar.chartOptions"
              :series="weekBar.series" />
          </div>
        </div>

        <div id="collapse-details" class="details" v-if="props.selected !== 'D' && showDetails"
          @click="showDetails = !showDetails">
          Collapse<span class="material-symbols-outlined">arrow_drop_down</span>
        </div>
      
    </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useStatStore } from '@/stores/stats';
import formatTime from '@/utils/formatTime';
import CustomBar from '@/components/stats/CustomBar.vue';
import TaskRatioList from '@/components/stats/TaskRatioList.vue';
import TimerCountCard from '@/components/stats/TimerCountCard.vue';
import MeanTimeCard from '@/components/stats/MeanTimeCard.vue';
import ApexBarChart from '@/components/stats/ApexBarChart.vue';
import ApexLineChart from '@/components/stats/ApexLineChart.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps(['selector', 'selected'])
const statStore = useStatStore()
const showDetails = ref(false)
watchEffect(() => showDetails.value = false)

// Each time we get the period inferior to the one for which we do the ratio
const weekTaskRatio = ref({"options" : null, "series" : null, "title" : "Task ratio per day"})
const monthTaskRatio = ref({"options" : null, "series" : null, "title" : "Task ratio per week"})
const yearTaskRatio = ref({"options" : null, "series" : null, "title" : "Task ratio per month"})
// Line charts
const daysLineChart = ref({"options" : null, "series" : null, "title" : "Total time per day"})
const weeksLineChart = ref({"options" : null, "series" : null, "title" : "Total time per week"})
const monthsLineChart = ref({"options" : null, "series" : null, "title" : "Total time per month"})

const resume = computed(() => {
    if (props.selected === 'D') {
        return statStore.daily
    } else if (props.selected === 'W') {
        return statStore.weekly
    } else if (props.selected === 'M') {
        return statStore.monthly
    } else {
        return statStore.yearly
    }
})

const weekBar = ref({
  series : [],
  chartOptions : {
      chart: {
          height: null,
          type: 'bar'
      },
      dataLabels: {
        enabled: false
      },
      yaxis: {
        stepSize: 7200,
        labels: {
          formatter: function (val) {
          return formatTime(val)
          }
        }
      },
      plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          }
  }
})


async function loadMore() {
    if (props.selected === "W") {
      const res = await statStore.getGenericWeekStats()
      weekTaskRatio.value["options"] = res.dates
      weekTaskRatio.value["series"] = res.stackedBarChart
      daysLineChart.value["options"] = res.dates
      daysLineChart.value["series"] = [res.daysLineChart]
    } else if (props.selected === 'M') {
      const res = await statStore.getGenericMonthStats()
      monthTaskRatio.value["options"] = res.weeks
      monthTaskRatio.value["series"] = res.stackedBarChart
      weeksLineChart.value["options"] = res.weeks
      weeksLineChart.value["series"] = [res.weeksLineChart]
    } else if (props.selected === 'Y') {
      const res = await statStore.getGenericYearStats()
      yearTaskRatio.value["options"] = res.months
      yearTaskRatio.value["series"] = res.stackedBarChart
      monthsLineChart.value["options"] = res.months
      monthsLineChart.value["series"] = [res.monthsLineChart]
      for (let i=0; i < Object.entries(res.weekLineChart).length; i++) {
        const [year, weeks] = Object.entries(res.weekLineChart)[i]
        weekBar.value.series.push({name : year, data : weeks})
      }
    }
    showDetails.value = true
}

function redirect() {
    router.push('/new')
}
</script>

<style scoped>
.cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  
}

#resume {
  display: flex;
  flex-direction: column;
  align-content: center;
}

.details {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  margin-top: 5%;
}

.incite {
  font-size: 1.5rem;
  margin: 1.5rem;
  text-align: center;
}

div.generic-stat {
  margin-top: 3rem;
}

label {
  margin-top: 1rem;
}

#collapse-details span.material-symbols-outlined {
  margin : auto 0;
  transform : rotate(180deg);
}

@media screen and (min-width: 480px) {
  .cards-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>