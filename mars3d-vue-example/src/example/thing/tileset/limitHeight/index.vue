<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span>分析区域</span>
        <mars-button @click="drawExtent">绘制矩形</mars-button>
        <mars-button @click="drawPolygon">绘制面</mars-button>
        <mars-button @click="clear">清除</mars-button>
      </a-space>
    </div>

    <a-space>
      <span>限定高度</span>
      <mars-slider @change="currHeight" v-model:value="inputValue" :min="0" :max="180" />高度{{ inputValue }}
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const inputValue = ref<number>(80)

const currHeight = () => {
  mapWork.currHeight(inputValue.value)
}
// 绘制矩形
const drawExtent = () => {
  mapWork.drawExtent()
}
// 绘制面
const drawPolygon = () => {
  mapWork.drawPolygon()
}
// 清除
const clear = () => {
  mapWork.clear()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 150px;
}
.infoView {
  width: 300px;
}
</style>
