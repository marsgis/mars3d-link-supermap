<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="createMap">创建地图</mars-button>
      <mars-button @click="destroyMap">销毁地图</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script lang="ts" setup>
import * as mapWork from "./map.js"
// 创建地图
const createMap = () => {
  mapWork.createMap()
}
// 销毁地图
const destroyMap = () => {
  mapWork.destroyMap()
}
</script>
