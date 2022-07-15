<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-collapse v-model:activeKey="activeKey">
      <!-- 自定义切换图标 -->
      <template #expandIcon>
        <mars-icon icon="down-c" class="icon-vertical-a" />
      </template>
      <!-- 数据处理面板 -->
      <a-collapse-panel key="1" header="地下模式">
        <div class="f-mb">
          <a-space>
            <span>地表透明度:</span>
            <mars-slider @change="alphaChange" :min="0" :max="1" :step="0.1" v-model:value="alphaVal" />
            <a-checkbox @change="chkUnderground" v-model:checked="formState.enabledGround">是否开启</a-checkbox>
          </a-space>
        </div>
      </a-collapse-panel>

      <!-- 参数调试面板 -->
      <a-collapse-panel key="2" header="地下开挖">
        <div class="f-mb">
          <a-space>
            <span class="mars-pannel-item-label">开挖深度</span>
            <mars-input-number @change="heightChange" :min="-500" :max="999" :step="1" v-model:value="heightVal"></mars-input-number>
            <a-checkbox @change="chkClippingPlanes" v-model:checked="formState.enabledClipping">是否开挖</a-checkbox>
          </a-space>
        </div>

        <div class="f-mb">
          <a-space>
            <mars-button @click="drawExtent">矩形</mars-button>
            <mars-button @click="drawPolygon">多边形</mars-button>
            <mars-button @click="clearWJ">清除</mars-button>
          </a-space>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="3" header="模型裁剪">
        <div class="f-mb">
          <a-space>
            <span class="mars-pannel-item-label">裁剪距离</span>
            <mars-slider @change="distanceChange" :min="-50" :max="50" :step="0.1" v-model:value="distanceVal" />
          </a-space>
        </div>

        <div class="f-mb">
          <a-space>
            <mars-button @click="clipTop">切顶</mars-button>
            <mars-button @click="clipBottom">切底</mars-button>
            <mars-button @click="clipPoly">内挖</mars-button>
            <mars-button @click="clipPoly2">外切</mars-button>
          </a-space>
        </div>

        <div class="f-mb">
          <a-space>
            <mars-button @click="clipLine">按线切</mars-button>
            <mars-button @click="clearClip">清除</mars-button>
          </a-space>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </mars-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"

import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  enabledGround: boolean
  enabledClipping: boolean
}

const activeKey = ref(["1", "2", "3"])

const formState: UnwrapRef<FormState> = reactive({
  enabledGround: false,
  enabledClipping: true
})

// 透明度
const alphaVal = ref<number>(0.5)

// 深度
const heightVal = ref<number>(30)

// 裁剪距离
const distanceVal = ref<number>(0)

mapWork.eventTarget.on("loadOk", () => {
  mapWork.terrainClips(heightVal.value)
})

const chkUnderground = () => {
  mapWork.chkUnderground(formState.enabledGround, alphaVal.value)
}

// 透明度改变
const alphaChange = () => {
  mapWork.alphaChange(alphaVal.value)
}

const chkClippingPlanes = () => {
  mapWork.chkClippingPlanes(formState.enabledClipping)
}

// 深度改变
const heightChange = () => {
  mapWork.heightChange(heightVal.value)
}
// 绘制矩形
const drawExtent = () => {
  mapWork.drawExtent()
}
// 绘制多边形
const drawPolygon = () => {
  mapWork.drawPolygon()
}
// 清除
const clearWJ = () => {
  mapWork.clearWJ()
}

const distanceChange = () => {
  mapWork.distanceChange(distanceVal.value)
}

// 切顶
const clipTop = () => {
  mapWork.clipTop()
}

// 切底
const clipBottom = () => {
  mapWork.clipBottom()
}

// 按线切
const clipLine = () => {
  mapWork.clipLine()
}

// 内切
const clipPoly = () => {
  mapWork.clipPoly()
}

const clipPoly2 = () => {
  mapWork.clipPoly2()
}
const clearClip = () => {
  mapWork.clearClip()
}
</script>
<style scoped lang="less">
.ant-input-number {
  width: 100px;
}

.ant-slider {
  width: 100px;
}
</style>
