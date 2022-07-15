<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="getDataSurfaceHeight">异步计算贴地高度{{ percent }}/{{ percentAll }}</mars-button>
      <mars-button @click="toGeojson">保存GeoJSON</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const percent = ref(0)
const percentAll = ref(0)

mapWork.eventTarget.on("geoJsonLayerLoad", function (event: any) {
  percentAll.value = event.geojsonLength
})

mapWork.eventTarget.on("computedResult", function (event: any) {
  percent.value = event.resultData.percent
})

// 保存为Geojson文件
const toGeojson = () => {
  mapWork.toGeojson()
}

// 异步计算贴地高度
const getDataSurfaceHeight = () => {
  mapWork.getDataSurfaceHeight()
}
</script>
