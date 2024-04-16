<template>
    <apexchart type="bar" height="350" :options="weekTaskRatio.chartOptions" :series="weekTaskRatio.series" />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(["options", "series", "title"])
const weekTaskRatio = ref({
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
            title: {
              text: props.title,
              align: 'left'
            },
            legend: {
              position: 'right',
              offsetY: 40
            },
            fill: {
              opacity: 1
            }
          }
        })
</script>

<style scoped>

</style>