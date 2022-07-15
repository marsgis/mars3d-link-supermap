<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-checkbox @change="isVChecked" v-model:checked="checked">开启天际线</a-checkbox>
    </div>

    <a-space>
      <span>线宽(像素):</span>
      <mars-input-number @change="lineWidth" v-model:value="value" :min="1" :max="10" />
      <mars-button @click="changeColor">换色</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const value = ref<number>(3)
const checked = ref(true)

// 换色
const changeColor = () => {
  mapWork.changeColor()
}

// 线宽
const lineWidth = () => {
  mapWork.lineWidth(value.value)
}

const isVChecked = () => {
  mapWork.isVChecked(checked.value)
}
</script>
<style scoped lang="less">
.ant-input-number {
  width: 60px !important;
}
</style>
