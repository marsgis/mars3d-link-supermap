<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div id="chart-container" style="width: 400px; height: 250px"></div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import * as echarts from "echarts"
import * as mapWork from "./map.js"

let myChart: any = null
let option: any = null

mapWork.eventTarget.on("dataLoaded", renderEcharts)
mapWork.eventTarget.on("dataUpdated", updateEcharts)

function renderEcharts(event: any) {
  myChart = echarts.init(document.getElementById("chart-container")!)
  const { heightArray, heightTDArray, distanceArray } = event

  option = {
    title: {
      text: "断面图",
      textStyle: {
        color: "#ffffff"
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    toolbox: {
      show: false,
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      data: ["地形高程", "设计高程"],
      textStyle: {
        color: "#ffffff"
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: distanceArray,
      axisLabel: {
        color: "#ffffff"
      }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} 米",
        color: "#ffffff"
      },
      axisPointer: {
        snap: true
      }
    },
    dataZoom: [
      {
        type: "inside"
      },
      {
        start: 0,
        end: 10,
        handleIcon:
          "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }
    ],
    series: [
      {
        name: "地形高程",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "rgb(255, 255, 0)"
          }
        },
        data: heightTDArray
      },
      {
        name: "设计高程",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "rgb(255, 70, 131)"
          }
        },
        data: heightArray,
        markPoint: undefined
      }
    ]
  }
  myChart.setOption(option, true)
}
function updateEcharts(event: any) {
  if (!myChart) {
    return
  }
  const { loc, height } = event
  const markPoint = {
    data: [
      {
        name: "车",
        value: "车",
        xAxis: loc + 5,
        yAxis: height
      }
    ]
  }
  myChart.setOption({
    series: [
      {
        name: "设计高程",
        markPoint: markPoint
      }
    ]
  })
}
</script>
<style lang="less" scoped></style>
