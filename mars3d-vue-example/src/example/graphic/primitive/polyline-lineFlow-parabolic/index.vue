<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-form-item label="速度:">
      <mars-slider @change="formStateChange" v-model:value="slideStep" :min="1" :max="100" :step="1" />
    </a-form-item>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const slideStep = ref<number>(10)
const formStateChange = () => {
  mapWork.changeSlide(slideStep.value)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 100px !important;
}
</style>
