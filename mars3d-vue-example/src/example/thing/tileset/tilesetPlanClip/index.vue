<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <a-collapse v-model:activeKey="activeKey">
      <!-- 自定义切换图标 -->
      <template #expandIcon>
        <mars-icon icon="down-c" class="icon-vertical-a" />
      </template>
      <a-collapse-panel key="1" header="单个裁剪面">
        <div class="f-mb">
          <a-space>
            <mars-button @click="drawLine">按绘制线裁剪</mars-button>
          </a-space>
        </div>

        <div class="f-mb">
          <a-space>
            <mars-button @click="mapWork.clippingType('ZR')">切顶部</mars-button>
            <mars-button @click="mapWork.clippingType('Z')">切底部</mars-button>
            <mars-button @click="mapWork.clippingType('XR')">切东向</mars-button>
          </a-space>
        </div>

        <div class="f-mb">
          <a-space>
            <mars-button @click="mapWork.clippingType('X')">切西向</mars-button>
            <mars-button @click="mapWork.clippingType('Y')">切南向</mars-button>
            <mars-button @click="mapWork.clippingType('YR')">切北向</mars-button>
          </a-space>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="2" header="多个裁剪面">
        <div class="f-mb">
          <a-space>
            <mars-button @click="drawExtent">绘制矩形</mars-button>
            <mars-button @click="drawPoly">绘制面</mars-button>
            <mars-button @click="drawPoly2">绘制外切面</mars-button>
          </a-space>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="3" header="裁剪参数">
        <a-space>
          <span class="mars-pannel-item-label">裁剪距离:</span>
          <mars-slider @change="rangeDistance" v-model:value="distanceVal" :min="-20" :max="30" :step="1.0" />值{{ distanceVal }}
        </a-space>

        <a-space>
          <span class="mars-pannel-item-label">斜切偏移量:</span>
          <mars-slider @change="rangeNormalZ" v-model:value="normalVal" :min="-10" :max="10" :step="0.1" />值{{ normalVal }}
        </a-space>
      </a-collapse-panel>
    </a-collapse>

    <div className="f-tac">
      <mars-button @click="clear">清除</mars-button>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

import * as mapWork from "./map.js"

const activeKey = ref(["1", "2", "3", "4"])
const distanceVal = ref<number>(0)
const normalVal = ref<number>(0)

const clear = () => {
  mapWork.clear()
}

// 距离
const rangeDistance = () => {
  mapWork.rangeDistance(distanceVal.value)
}
// 偏移量
const rangeNormalZ = () => {
  mapWork.rangeNormalZ(normalVal.value)
}

// 绘制线
const drawLine = () => {
  mapWork.drawLine()
}

// 绘制矩形
const drawExtent = () => {
  mapWork.drawExtent()
}

// 绘制面
const drawPoly = () => {
  mapWork.drawPoly()
}

// 绘制面(外切)
const drawPoly2 = () => {
  mapWork.drawPoly2()
}
</script>
<style scoped lang="less">
.infoView {
  width: 300px;
}
.ant-slider {
  width: 100px;
}
.mars-pannel-item-label {
  width: 74px;
}
</style>
