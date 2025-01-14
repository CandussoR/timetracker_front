<template>
    <main id="stats-page">
      <div id="main" class="main-container">
        <h1>Stats</h1>
        <div id="time-span__header">
            <span id="left-arrow" class="material-symbols-outlined" @click="handleBack">arrow_back</span>
            <h2 v-if="selected === 'D'">Today</h2>
            <h2 v-else-if="selected === 'W'">This Week</h2>
            <h2 v-else-if="selected === 'M'">This Month</h2>
            <h2 v-else>This Year</h2>
            <span id="right-arrow" class="material-symbols-outlined" @click="handleForward">arrow_forward</span>
            <span id="refresh" class="material-symbols-outlined" @click="refresh">refresh</span>
        </div>
    
        <div v-if="loading" class="loader">
        </div>

        <div v-else>
          <div id="cards-row" class="cards-row">
            <TimerCountCard v-if="resume.count && resume.time" :count="resume.count" :time="resume.time"/>
            <MeanTimeCard v-if="resume.mean" :mean="resume.mean" :selected="selector[selected]"/>
          </div>

          <div id="resume" v-if="!resume.count || (resume.time === 0)">
            <p id="incite" class="incite">No timer yet ! Go do one !</p>
            <button @click="redirect" class="button primary">New timer</button>
          </div>
    
        <CustomBar :data="statStore.taskRatio"/>

        <TaskRatioList :data="statStore.taskRatio"/> 
    
          <div id="details" v-if="selected !== 'D'" @click="loadMore()">
            More details !<span class="material-symbols-outlined">arrow_drop_down</span>
          </div>
    
          <div id="generic-stat" class="generic-stat" v-if="generic">
              <div v-if="selected === 'W'" id="chart">
                <ApexLineChart :options="daysLineChart['options']" :series="daysLineChart['series']" :title="daysLineChart['title']"/>
                <ApexBarChart :options="weekTaskRatio['options']" :series="weekTaskRatio['series']" :title="weekTaskRatio['title']"/>
              </div>
              <div v-else-if="selected === 'M'" id="chart">
                <ApexLineChart :options="weeksLineChart['options']" :series="weeksLineChart['series']" :title="weeksLineChart['title']"/>
                <ApexBarChart :options="monthTaskRatio['options']" :series="monthTaskRatio['series']" :title="monthTaskRatio['title']"/>
              </div>
              <div v-else-if="selected === 'Y'" id="chart">
                <ApexLineChart :options="monthsLineChart['options']" :series="monthsLineChart['series']" :title="monthsLineChart['title']"/>
                <ApexBarChart :options="yearTaskRatio['options']" :series="yearTaskRatio['series']" :title="yearTaskRatio['title']"/>
                <label class="chart-title" for="bar-chart__week">Time per week</label>
                <apexchart id="bar-chart__week" type="bar" width="550" height="450" :options="weekBar.chartOptions" :series="weekBar.series"/>
              </div>
          </div>
        </div>
      </div>
  </main>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStatStore } from '../stores/stats';
import formatTime from '../utils/formatTime';
import CustomBar from '@/components/stats/CustomBar.vue';
import TaskRatioList from '@/components/stats/TaskRatioList.vue';
import TimerCountCard from '@/components/stats/TimerCountCard.vue';
import MeanTimeCard from '@/components/stats/MeanTimeCard.vue';
import { useRouter } from 'vue-router';
import ApexBarChart from '@/components/stats/ApexBarChart.vue';
import ApexLineChart from '@/components/stats/ApexLineChart.vue';

const router = useRouter()
const statStore = useStatStore()
const loading = ref(true)
const selected = ref("D")
const selector = {
    "D": "day",
    "W": "week",
    "M": "month",
    "Y": "year"
}

const resume = computed(() => {
    if (selected.value === 'D') {
        return statStore.daily
    } else if (selected.value === 'W') {
        return statStore.weekly
    }else if (selected.value === 'M') {
        return statStore.monthly
    } else {
        return statStore.yearly
    }
})

const generic = ref(false)
// Each time we get the period inferior to the one for which we do the ratio
const weekTaskRatio = ref({"options" : null, "series" : null, "title" : "Task ratio per day"})
const monthTaskRatio = ref({"options" : null, "series" : null, "title" : "Task ratio per week"})
const yearTaskRatio = ref({"options" : null, "series" : null, "title" : "Task ratio per month"})
// Line charts
const daysLineChart = ref({"options" : null, "series" : null, "title" : "Total time per day"})
const weeksLineChart = ref({"options" : null, "series" : null, "title" : "Total time per week"})
const monthsLineChart = ref({"options" : null, "series" : null, "title" : "Total time per month"})

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
          },
      title: {
        text: 'Total time per week',
        align: 'left'
      }
  }
})

onMounted(async () => {
    // in case of a refresh which empties the store
    if (!statStore.daily) {
        await statStore.getHomeStats()
    }
    await statStore.getTaskTimeRatio(selector[selected.value])
    loading.value = false
})

async function handleBack() {
    if (selected.value != 'D') {
        const entries = Object.entries(selector).map(x => x[0])
        selected.value = entries[entries.indexOf(selected.value)-1]
        await statStore.getTaskTimeRatio(selector[selected.value])
        generic.value = false
    }
}

async function handleForward() {
    if (selected.value != 'Y') {
        const entries = Object.entries(selector).map(x => x[0])
        selected.value = entries[entries.indexOf(selected.value)+1]
        await statStore.getTaskTimeRatio(selector[selected.value])
        generic.value = false
    }
}

async function loadMore() {
    if (selected.value === "W") {
      const res = await statStore.getGenericWeekStats()
      weekTaskRatio.value["options"] = res.dates
      weekTaskRatio.value["series"] = res.stackedBarChart
      daysLineChart.value["options"] = res.dates
      daysLineChart.value["series"] = [res.daysLineChart]
      generic.value = true
    } else if (selected.value === 'M') {
      const res = await statStore.getGenericMonthStats()
      monthTaskRatio.value["options"] = res.weeks
      monthTaskRatio.value["series"] = res.stackedBarChart
      weeksLineChart.value["options"] = res.weeks
      weeksLineChart.value["series"] = [res.weeksLineChart]
      console.log(weeksLineChart.value)
      generic.value = true
    } else if (selected.value === 'Y') {
      const res = await statStore.getGenericYearStats()
      yearTaskRatio.value["options"] = res.months
      yearTaskRatio.value["series"] = res.stackedBarChart
      monthsLineChart.value["options"] = res.months
      monthsLineChart.value["series"] = [res.monthsLineChart]
      for (let i=0; i < Object.entries(res.weekLineChart).length; i++) {
        const [year, weeks] = Object.entries(res.weekLineChart)[i]
        weekBar.value.series.push({name : year, data : weeks})
      }
      generic.value = true
    }
}

async function refresh() {
    loading.value = true
    generic.value = false
    await statStore.getHomeStats()
    await statStore.getTaskTimeRatio(selector[selected.value])
    loading.value = false
}

function redirect() {
    router.push("/new")
}
</script>

<style scoped>
/* #stats-page {
  display: flex;
  flex-direction: row;
} */

.main-container {
  display: flex;
  flex-direction: column;
  margin: auto; 
}

#time-span__header {
  width: 80%;
  display : flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto; 
  margin-bottom: 5%;
}

#time-span__header > #left-arrow {
  padding-right: 5%;
}

#time-span__header > #right-arrow {
  padding-left: 5%;
}

/* Distance between buttons */
#time-span__header > span.material-symbols-outlined:first-child,
#time-span__header > span.material-symbols-outlined:last-child
 {
    margin-left: auto;
}

.cards-row {
  display: grid;
  grid-template-columns: 1fr;
  
}

#resume {
  display: flex;
  flex-direction: column;
  align-content: center;
}

#details {
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

@media screen and (min-width: 480px) {
  .cards-row {
    grid-template-columns: 1fr 1fr;
  }
  .main-container {
    width: 80%;
  }
}
</style>