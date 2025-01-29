<template>
    <apexchart :id="props.id" type="line" height="350" :options="lineChart.chartOptions" :series="lineChart.series"/>
</template>

<script setup>
import { ref } from 'vue';
import formatTime from '@/utils/formatTime';

const props = defineProps(["id", "options", "series", "title"])

const lineChart = ref(  {
    series: props.series,
    chartOptions: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true,
        position: 'top',
        offsetY: -10,
        formatter: function (val) {
          return formatTime(val)
        }
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: props.options,
      },
    yaxis: {
        labels: {
          formatter: function (val) {
          return formatTime(val)
          }
        }
      },
    }
  } )
</script>

<style scoped>

</style>