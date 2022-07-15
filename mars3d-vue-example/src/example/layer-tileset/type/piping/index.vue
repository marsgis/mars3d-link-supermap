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

      <a-collapse-panel key="2" header="地下开挖">
        <div class="f-mb">
          <a-space>
            <span>开挖深度:</span>
            <mars-input-number @change="heightChange" :min="-500" :max="999" :step="1" v-model:value="heightVal"></mars-input-number>

            <a-checkbox @change="chkClippingPlanes" v-model:checked="formState.enabledClipping">是否挖地</a-checkbox>
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

      <a-collapse-panel key="3" header="演示视角">
        <div class="f-tac">
          <a-space>
            <mars-button @click="centerAtDX1">俯视视角</mars-button>
            <mars-button @click="centerAtDX2">地下视角</mars-button>
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

// 深度
const heightVal = ref<number>(30)

// 深度改变
const heightChange = () => {
  mapWork.heightChange(heightVal.value)
}

// 透明度
const alphaVal = ref<number>(0.5)
// 透明度改变
const alphaChange = () => {
  mapWork.alphaChange(alphaVal.value)
}

const chkUnderground = () => {
  mapWork.chkUnderground(formState.enabledGround, alphaVal.value)
}

const chkClippingPlanes = () => {
  mapWork.chkClippingPlanes(formState.enabledClipping)
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

// 演示视角
const centerAtDX1 = () => {
  mapWork.centerAtDX1()
}

const centerAtDX2 = () => {
  mapWork.centerAtDX2()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 100px;
}
.ant-input-number {
  width: 100px;
}
</style>
