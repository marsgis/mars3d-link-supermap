<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div>
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">启用:</span>
          <mars-switch v-model:checked="formState.enabled" @change="onChangeState" />
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">雾颜色:</span>
          <mars-color-picker v-model:value="formState.color" @change="onChangeColor" />
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">近距离:</span>
          <mars-slider v-model:value="formState.fogByDistanceX" @change="onChangeDistanceX" :min="1" :max="5000" :step="1" />
        </a-space>
      </div>
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">远距离:</span>
          <mars-slider v-model:value="formState.fogByDistanceZ" @change="onChangeDistanceZ" :min="100" :max="50000" :step="1" />
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import * as mapWork from "./map.js"
import { $message } from "@mars/components/mars-ui/index"

const formState = reactive({
  enabled: true,
  color: "#ffffff",
  fogByDistanceX: 100,
  fogByDistanceZ: 9000
})

const onChangeState = () => {
  mapWork.setFogEffect(formState.enabled)
}
const onChangeColor = (e) => {
  mapWork.setColor(formState.color)
}
const onChangeDistanceX = () => {
  if (formState.fogByDistanceX > formState.fogByDistanceZ) {
    $message("近距离 不能大于 远距离")
    return
  }
  mapWork.setDistanceX(formState.fogByDistanceX)
}
const onChangeDistanceZ = () => {
  if (formState.fogByDistanceX > formState.fogByDistanceZ) {
    $message("远距离 不能小于 近距离")
    return
  }
  mapWork.setDistanceZ(formState.fogByDistanceZ)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 140px;
}
</style>
