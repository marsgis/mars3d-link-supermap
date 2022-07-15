<template>
  <!-- UI面板 -->
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="measureSection">绘制线</mars-button>
      <mars-button @click="clear">清除</mars-button>
    </a-space>
  </mars-dialog>

  <!-- ecahrt图表 -->
  <mars-dialog v-model:visible="isShow" left="70" right="70" bottom="40" z-index="100">
    <div class="echatsView">
      <div id="echartsView1" style="width: 100%; height: 100%"></div>
    </div>
  </mars-dialog>

  <location-to />
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import * as echarts from "echarts"
import * as mapWork from "./map.js"

const isShow = ref<boolean>(false)

let myChart1: echarts.ECharts

// 图表自适应
window.onresize = function () {
  myChart1.resize()
}

onMounted(() => {
  myChart1 = echarts.init(document.getElementById("echartsView1")!)
})

mapWork.eventTarget.on("measureEnd", function (event: any) {
  isShow.value = true
  nextTick(() => {
    setEchartsData(event)
  })
})

mapWork.eventTarget.on("measureClick", function (event: any) {
  if (event.value) {
    nextTick(() => {
      setEchartsData(event.value)
    })
  }
})

const measureSection = () => {
  mapWork.measureSection()
}

const clear = () => {
  mapWork.removeAll()
  isShow.value = false
  myChart1.clear()
}

function setEchartsData(data: any) {
  if (data == null || data.arrPoint == null) {
    return
  }
  const arrPoint = data.arrPoint
  let inhtml = ""

  const option = {
    grid: {
      left: 10,
      right: 40,
      bottom: 10,
      top: 40,
      containLabel: true
    },
    dataZoom: [
      {
        type: "inside",
        throttle: 50
      }
    ],
    tooltip: {
      trigger: "axis",
      // position: function (point, params, dom, rect, size) {
      //    return [10, 20];
      // },
      formatter: (params: any) => {
        if (params.length === 0) {
          mapWork.hideTipMarker()
          return inhtml
        }

        const hbgd = params[0].value // 海拔高度
        const point = arrPoint[params[0].dataIndex] // 所在经纬度
        const result = mapWork.calculation(params[0])

        inhtml = `当前位置<br />
                      距起点：${result.len}<br />
                      海拔：<span style='color:${params[0].color};'>${result.hbgdStr}</span><br />
                      经度：${point.lng}<br />
                      纬度：${point.lat}`

        mapWork.showTipMarker(point, hbgd, inhtml)

        return inhtml
      }
    },
    xAxis: [
      {
        name: "行程",
        type: "category",
        nameTextStyle: { color: "rgb(255, 70, 131)" },
        boundaryGap: false,
        axisLine: {
          show: true
        },
        axisLabel: {
          show: true,
          formatter: "{value} 米",
          color: "#fff"
        },
        data: data.arrLen
      }
    ],
    yAxis: [
      {
        name: "高程",
        nameTextStyle: { color: "rgb(255, 70, 131)" },
        type: "value",
        min: getMinZ(arrPoint),
        axisLabel: {
          formatter: "{value} 米",
          color: "#fff"
        }
      }
    ],
    series: [
      {
        name: "高程值",
        type: "line",
        smooth: true,
        symbol: "none",
        sampling: "average",
        itemStyle: {
          normal: {
            color: "rgb(255, 70, 131)"
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)"
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)"
              }
            ])
          }
        },
        data: data.arrHB
      }
    ]
  }

  myChart1.setOption(option)
  myChart1.resize()
}

function getMinZ(arr: any) {
  let minz = "dataMin"
  if (arr == null || arr.length === 0) {
    return minz
  }

  minz = arr[0].alt
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].alt < minz) {
      minz = arr[i].alt
    }
  }
  return minz
}
</script>
<style scoped lang="less">
.echatsView {
  width: 100%;
  height: 240px;
}
</style>
