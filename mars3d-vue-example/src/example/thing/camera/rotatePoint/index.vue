<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button @click="startRotate">开始</mars-button>
      <mars-button @click="stopRotate">停止</mars-button>
    </a-space>
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import * as mapWork from "./map.js"

// 随机点
const startRotate = () => {
  mapWork.startRotate()
}
// 清除
const stopRotate = () => {
  mapWork.stopRotate()
}
</script>
