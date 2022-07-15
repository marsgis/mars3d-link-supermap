<template>
  <mars-dialog :visible="true" right="10" top="10">
    <p class="f-mb">单个裁剪面:</p>
    <div class="f-mb">
      <a-space>
        <mars-button @click="drawLine">按绘制线裁剪</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <mars-button @click="mapWork.clippingType('ZR')">切顶部</mars-button>
        <mars-button @click="mapWork.clippingType('Z')">切底部</mars-button>
        <mars-button @click="mapWork.clippingType('XR')">切东向</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <mars-button @click="mapWork.clippingType('X')">切西向</mars-button>
        <mars-button @click="mapWork.clippingType('Y')">切南向</mars-button>
        <mars-button @click="mapWork.clippingType('YR')">切北向</mars-button>
      </a-space>
    </div>

    <p class="f-mb">多个裁剪面:</p>
    <div class="f-mb">
      <a-space>
        <mars-button @click="drawExtent">绘制矩形</mars-button>
        <mars-button @click="drawPoly">绘制面</mars-button>
        <mars-button @click="drawPoly2">绘制面(外切）</mars-button>
      </a-space>
    </div>

    <p>裁剪面参数:</p>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">裁剪距离</span>
        <mars-slider @change="distance" v-model:value="distanceValue" :min="-100" :max="100" />
        <mars-input-number @change="txtDistance" v-model:value="distanceValue" :min="-100" :max="100" />米
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">斜切偏移量</span>
        <mars-slider @change="deviation" v-model:value="deviationValue" :min="-10" :max="10" />
        <mars-input-number @change="txtDeviation" v-model:value="deviationValue" :min="-10" :max="10" />米
      </a-space>
    </div>

    <div class="f-tac"><mars-button @click="clear">清除</mars-button></div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const distanceValue = ref<number>(0)
const deviationValue = ref<number>(0)

// 绘制线
const drawLine = () => {
  mapWork.drawLine()
}
// 绘制矩形
const drawExtent = () => {
  mapWork.drawExtent()
}
// 绘制面
const drawPoly = () => {
  mapWork.drawPoly()
}
// 绘制面(外切)
const drawPoly2 = () => {
  mapWork.drawPoly2()
}

const distance = () => {
  mapWork.rangeDistance(distanceValue.value)
}
const txtDistance = () => {
  mapWork.rangeDistance(distanceValue.value)
}

const deviation = () => {
  mapWork.rangeNormalZ(deviationValue.value)
}
const txtDeviation = () => {
  mapWork.rangeNormalZ(deviationValue.value)
}
const clear = () => {
  mapWork.clear()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 100px;
}
.ant-input-number {
  width: 60px;
}
</style>
