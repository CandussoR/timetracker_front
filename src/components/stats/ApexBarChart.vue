<template>
    <apexchart :id="props.id" type="bar" height="350" :options="taskRatio.chartOptions" :series="taskRatio.series" />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(["id", "options", "series", "title"])
const taskRatio = ref({
          series: props.series,
          chartOptions: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: '100%'
            },
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            xaxis: {
              categories: props.options
            },
            legend: {
              position: 'right',
              offsetY: 40
            },
            fill: {
              opacity: 1
            }
          },
        })
</script>

<style>
.apexcharts-tooltip {
  font-family: var(--font-family);
  color: black;
}
div.apexcharts-menu-item {
  color: black;
}
div.apexcharts-menu-item.exportSVG:hover,
div.apexcharts-menu-item.exportPNG:hover,
div.apexcharts-menu-item.exportCSV:hover {
  background-color: var(--secondary);
  color: white;
} 
</style>