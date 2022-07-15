<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <span>夸张程度:</span>
      <mars-slider :min="1" :max="50" v-model:value="terrainExaggeration" @change="formStateChange" />
    </a-space>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import * as mapWork from "./map.js"

const terrainExaggeration = ref<number>(10)
const formStateChange = () => {
  mapWork.changeTerrain(terrainExaggeration.value)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 90px;
}
</style>
