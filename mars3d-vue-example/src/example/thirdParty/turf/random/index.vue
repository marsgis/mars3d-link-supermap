<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="randomPoints">随机点</mars-button>
      <mars-button @click="randomPolylines">随机线</mars-button>
      <mars-button @click="randomPolygons">随机面</mars-button>
      <mars-button @click="clearAll">清除</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"

// 随机点
const randomPoints = () => {
  mapWork.randomPoints()
}
// 随机线
const randomPolylines = () => {
  mapWork.randomPolylines()
}
// 随机面
const randomPolygons = () => {
  mapWork.randomPolygons()
}
// 清除
const clearAll = () => {
  mapWork.clearAll()
}
</script>
