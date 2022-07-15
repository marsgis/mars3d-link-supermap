<template>
  <mars-dialog :visible="true" right="10" top="10" width="350">
    <p class="f-mb">
      提示：单击分析按钮激活绘制分析，对绘制面(墙)内的进行以下计算。<br />
      1. 挖方量: 计算“基准面”到地表之间的凸出部分进行挖掉的体积。<br />
      2. 填方量：计算“基准面”与“墙底部”之间的缺少部分进行填平的体积。
    </p>
    <div class="f-mb">
      <a-space>
        <mars-button @click="analysisMeasure">绘制分析区域</mars-button>
        <mars-button @click="clear">清除</mars-button>
        <a-checkbox @change="showResult" v-model:checked="checked">显示面内三角网</a-checkbox>
      </a-space>
    </div>
    <div class="f-mb height">
      <a-space>
        <span class="mars-pannel-item-label">基准面高(米):</span>
        <mars-input-number @change="baseHeight" id="inputNumber" v-model:value="baseValue" step="0.1" />
        <mars-button @click="selHeight">点选高度</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">围墙底高(米):</span>
        <mars-input-number @change="txtMinHeight" id="inputNumber" v-model:value="bottomValue" step="0.1" />
      </a-space>
    </div>
    <div>
      <a-space>
        <span class="mars-pannel-item-label">围墙顶高(米):</span>
        <mars-input-number @change="txtMaxHeight" id="inputNumber" v-model:value="topValue" step="0.1" />
      </a-space>
    </div>
  </mars-dialog>

  <location-to />
</template>

<script setup lang="ts">
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import { onMounted, ref } from "vue"
import * as mapWork from "./map.js"

const baseValue = ref<number>()

const bottomValue = ref<number>()

const topValue = ref<number>()

const checked = ref(false)

// 方量分析
const analysisMeasure = () => {
  mapWork.analysisMeasure()
}
// 清除
const clear = () => {
  mapWork.clear()
}

// 复选框显示结果
const showResult = () => {
  const isShow = mapWork.showResult(checked.value)
  checked.value = isShow
}

// 基础高度修改
const baseHeight = () => {
  mapWork.baseHeight(baseValue.value)
}

// 修改底高
const txtMinHeight = () => {
  mapWork.txtMinHeight(bottomValue.value)
}

// 修改顶高
const txtMaxHeight = () => {
  mapWork.txtMaxHeight(topValue.value)
}

// 点选高度
const selHeight = () => {
  mapWork.selHeight()
}
mapWork.eventTarget.on("heightVal", function (event: any) {
  showResult()
  baseValue.value = event.baseHeight
  bottomValue.value = event.minHeight
  topValue.value = event.maxHeight
})
</script>
<style scoped lang="less">
.mars-pannel-item-label {
  width: 90px;
}

.height {
  .ant-input-number {
    width: 130px !important;
  }
}

.ant-input-number {
  width: 210px !important;
}
</style>
