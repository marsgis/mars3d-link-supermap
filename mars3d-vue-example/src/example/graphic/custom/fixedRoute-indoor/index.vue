<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span>漫游控制:</span>
        <mars-button @click="startFly">开始漫游</mars-button>
        <mars-button @click="stopFly">停止漫游</mars-button>
      </a-space>
    </div>

    <a-space>
      <span>室内视角:</span>
      <mars-button @click="centerAtDX1">教室</mars-button>
      <mars-button @click="centerAtDX2">走廊</mars-button>
      <mars-button @click="centerAtDX3">楼梯间</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"

const startFly = () => {
  mapWork.startFly()
}
const stopFly = () => {
  mapWork.stopFly()
}
const centerAtDX1 = () => {
  mapWork.centerAtDX1()
}
const centerAtDX2 = () => {
  mapWork.centerAtDX2()
}
const centerAtDX3 = () => {
  mapWork.centerAtDX3()
}
</script>
