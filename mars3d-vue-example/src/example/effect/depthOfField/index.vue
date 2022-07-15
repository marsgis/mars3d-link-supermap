<template>
  <mars-dialog :visible="true" right="10" top="10" width="190">
    <a-form>
      <a-form-item label="启用">
        <mars-switch v-model:checked="formState.enabled" @change="onChangeState" />
      </a-form-item>

      <a-form-item label="焦距">
        <mars-slider v-model:value="formState.focalDistance" @change="onChangeFocalDistance" :min="0.0" :max="500.0" :step="1" />
      </a-form-item>
      <a-form-item label="增量">
        <mars-slider v-model:value="formState.delta" @change="onChangeDelta" :min="0.1" :max="2" :step="0.01" />
      </a-form-item>
      <a-form-item label="Sigma">
        <mars-slider v-model:value="formState.sigma" @change="onChangeigma" :min="0.5" :max="5" :step="0.01" />
      </a-form-item>
      <a-form-item label="步长">
        <mars-slider v-model:value="formState.stepSize" @change="onChangeStepSize" :min="0" :max="7" :step="0.01" />
      </a-form-item>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import * as mapWork from "./map.js"

const formState = reactive({
  enabled: true,
  focalDistance: 87,
  delta: 1,
  sigma: 3.78,
  stepSize: 2.46
})

const onChangeState = () => {
  mapWork.setDepthOfField(formState.enabled)
}

const onChangeFocalDistance = () => {
  mapWork.setFocalDistance(formState.focalDistance)
}

const onChangeDelta = () => {
  mapWork.setDelta(formState.delta)
}

const onChangeigma = () => {
  mapWork.setSigma(formState.sigma)
}

const onChangeStepSize = () => {
  mapWork.setStepSize(formState.stepSize)
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 100px;
}
</style>
