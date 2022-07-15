<template>
  <mars-dialog :visible="true" right="10" top="10" width="200px">
    <a-form>
      <a-form-item label="状态:">
        <a-checkbox @change="onChangeState" v-model:checked="enabled">开启效果</a-checkbox>
      </a-form-item>

      <a-form-item label="亮度:">
        <mars-slider @change="onChangeBrightness" v-model:value="brightness" :min="0" :max="5" :step="0.01" />
      </a-form-item>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const brightness = ref<number>(2)

const enabled = ref(true)

// 亮度
const onChangeBrightness = () => {
  mapWork.setBrightness(brightness.value)
}

const onChangeState = () => {
  mapWork.setBrightnessEffect(enabled.value)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 120px;
}
</style>
