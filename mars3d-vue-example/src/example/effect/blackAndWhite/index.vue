<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">启用:</span>
        <mars-switch v-model:checked="enabled" @change="onChangeState" />
      </a-space>
    </div>

    <div>
      <a-space>
        <span class="mars-pannel-item-label">渐变量:</span>
        <mars-slider @change="onChangeGradations" v-model:value="gradations" :min="1" :max="10" :step="0.01" />
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const gradations = ref<number>(4)

const enabled = ref(true)

// 亮度
const onChangeGradations = () => {
  mapWork.setGradations(gradations.value)
}

const onChangeState = () => {
  mapWork.setEnabled(enabled.value)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 110px;
}
</style>
