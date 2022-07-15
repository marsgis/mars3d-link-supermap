<template>
  <mars-dialog :visible="true" right="10" top="10" width="280">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">经度</span>
        <mars-input-number :step="0.000001" v-model:value="formState.lng" @change="onChangePosition" style="width: 100%">经度</mars-input-number>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">纬度</span>
        <mars-input-number :step="0.000001" v-model:value="formState.lat" @change="onChangePosition" style="width: 100%">纬度</mars-input-number>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">高度</span>
        <mars-input-number :step="0.1" v-model:value="formState.alt" @change="onChangePosition" style="width: 100%">高度</mars-input-number>
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">盒子X长度</span>
        <mars-slider @change="onChangeDimensionsX" v-model:value="formState.lengthX" :min="0" :max="100" :step="1.0" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">盒子Y长度</span>
        <mars-slider @change="onChangeDimensionsY" v-model:value="formState.lengthY" :min="0" :max="100" :step="1.0" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">盒子Z长度</span>
        <mars-slider @change="onChangeDimensionsZ" v-model:value="formState.lengthZ" :min="0" :max="100" :step="1.0" />
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">盒子</span>
        <a-checkbox @change="checkBox" v-model:checked="formState.isShowBox">是否显示</a-checkbox>
      </a-space>
    </div>

    <div class="f-tac">
      <a-space>
        <mars-button @click="drawExtent">绘制Box</mars-button>
        <mars-button @click="clear">清除</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  lng: number
  lat: number
  alt: number
  lengthX: number
  lengthY: number
  lengthZ: number
  isShowBox: boolean
}

const formState: UnwrapRef<FormState> = reactive({
  lng: 117.251283,
  lat: 31.843707,
  alt: 43.7,
  lengthX: 20,
  lengthY: 10,
  lengthZ: 15,
  isShowBox: true
})

onMounted(() => {
  const point = [formState.lng, formState.lat, formState.alt]
  mapWork.tilesetBoxClipDemo(point)
})
// 监听到事件
mapWork.eventTarget.on("hasDraw", (item: any) => {
  formState.lng = item.point.lng
  formState.lat = item.point.lat
  formState.alt = item.point.alt
})

// 清除
const clear = () => {
  mapWork.clear()
}

// 绘制
const drawExtent = () => {
  mapWork.drawExtent()
}

// 经度改变
const onChangePosition = () => {
  const point = [formState.lng, formState.lat, formState.alt]

  mapWork.onChangePosition(point)
}

// 是否显示盒子
const checkBox = () => {
  mapWork.showModelMatrix(formState.isShowBox)
}

// X长度改变
const onChangeDimensionsX = () => {
  mapWork.onChangeDimensionsX(formState.lengthX)
}

// Y长度改变
const onChangeDimensionsY = () => {
  mapWork.onChangeDimensionsY(formState.lengthY)
}

// Z长度改变
const onChangeDimensionsZ = () => {
  mapWork.onChangeDimensionsZ(formState.lengthZ)
}
</script>
<style scoped lang="less">
.infoView {
  width: 268px;
}
.ant-slider {
  width: 158px;
}
</style>
