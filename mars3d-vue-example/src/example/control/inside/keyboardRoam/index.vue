<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span>演示视角：</span>
        <mars-button @click="onChangeCenterAtDX1">室内</mars-button>
        <mars-button @click="onChangeCenterAtDX2">室外</mars-button>
      </a-space>
    </div>
    <div class="f-mb sliderLength">
      <span title="平移的步长（单位：米）" class="tip-name">平移步长:</span>
      <mars-slider v-model:value="slideStep" @change="onChangeSlider" tooltipPlacement="bottom" :min="0" :max="300" :step="0.01" />
    </div>
    <div class="f-mb">
      <img src="/img/tietu/keyboard.png" alt="" />
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const slideStep = ref<number>(10)

const onChangeSlider = () => {
  mapWork.changeSlider(slideStep.value)
}
const onChangeCenterAtDX1 = () => {
  mapWork.centerAtDX1()
}
const onChangeCenterAtDX2 = () => {
  mapWork.centerAtDX2()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 200px;
  display: inline-block;
}
.ant-row {
  margin-bottom: 10px;
}
.tip-name {
  line-height: 35px;
}
</style>
