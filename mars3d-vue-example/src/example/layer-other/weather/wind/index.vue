<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">速度系数:</span>
        <mars-slider v-model:value="formState.speedFactor" @change="onParticleSystemOptionsChange" :min="0.05" :max="1" :step="0.01" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">线宽度:</span>

        <mars-slider v-model:value="formState.lineWidth" @change="onParticleSystemOptionsChange" :min="0.01" :max="16.0" :step="0.01" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">下降率:</span>
        <mars-slider v-model:value="formState.dropRate" @change="onParticleSystemOptionsChange" :min="0.0" :max="0.1" :step="0.001" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">下降速度:</span>
        <mars-slider v-model:value="formState.dropRateBump" @change="onParticleSystemOptionsChange" :min="0.0" :max="0.2" :step="0.001" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">粒子总数:</span>
        <mars-slider v-model:value="formState.particlesNumber" @change="onParticleSystemOptionsChange" :min="1" :max="256 * 256" :step="1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">透明度:</span>

        <mars-slider v-model:value="formState.fadeOpacity" @change="onParticleSystemOptionsChange" :min="0.9" :max="0.999" :step="0.001" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">固定高度:</span>
        <mars-slider v-model:value="formState.fixedHeight" @change="onParticleSystemOptionsChange" :min="1" :max="10000" :step="1" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">线颜色:</span>
        <mars-color-picker v-model:value="formState.color" @change="changeColor" />
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  particlesNumber: number
  fixedHeight: number
  fadeOpacity: number
  dropRate: number
  dropRateBump: number
  speedFactor: number
  lineWidth: number
  color: string
}

const labelCol = ref({ span: 8 })
const labelAlign = ref("left")

const formState: UnwrapRef<FormState> = reactive({
  particlesNumber: 9000,
  fixedHeight: 0.0,
  fadeOpacity: 0.996,
  dropRate: 0.003,
  dropRateBump: 0.01,
  speedFactor: 0.2,
  lineWidth: 4.0,
  color: "#4696db"
})

// 参数调节面板
const onParticleSystemOptionsChange = () => {
  mapWork.onParticleSystemOptionsChange(formState)
}

// 修改颜色
const changeColor = (e) => {
  mapWork.changeColor(formState.color)
}
</script>
<style scoped lang="less">
:deep(.ant-slider) {
  width: 160px !important;
}
.mars-pannel-item-label {
  width: 60px;
}
</style>
