<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span>步长:</span>
        <mars-input-number v-model:value="step" :min="1" :max="10" @change="onChangeGrid" />
        公里
      </a-space>
    </div>

    <a-space>
      <span>类型:</span>
      <a-radio-group v-model:value="gridType" name="grid" @change="onChangeGrid">
        <a-radio value="point">点</a-radio>
        <a-radio value="triangle">三角网</a-radio>
        <a-radio value="square">方格网</a-radio>
        <a-radio value="hex">蜂窝网</a-radio>
      </a-radio-group>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const gridType = ref("")
const step = ref<number>(5)

const onChangeGrid = () => {
  switch (gridType.value) {
    case "point":
      mapWork.pointGrid(step.value)
      break

    case "triangle":
      mapWork.triangleGrid(step.value)
      break

    case "square":
      mapWork.squareGrid(step.value)
      break

    case "hex":
      mapWork.hexGrid(step.value)
      break

    default:
      break
  }
}
</script>
<style scoped lang="less">
.ant-input-number {
  width: 100px !important;
}
</style>
