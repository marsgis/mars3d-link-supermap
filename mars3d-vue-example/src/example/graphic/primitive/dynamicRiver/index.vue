<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state :defaultCount="100" :customEditor="'dynamicRiver'" @onStartEditor="onStartEditor" @onStopEditor="onStopEditor" />
    <span style="color: #ccc">提示:沿水流方向选点，直线也多标点</span>
  </mars-dialog>

  <mars-dialog
    left="10"
    top="10"
    :draggable="true"
    :title="pannelTitle"
    :visible="selectedGraphic"
    :beforeClose="
      () => {
        selectedGraphic = false
      }
    "
  >
    <!-- 参数调试面板 -->
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">河宽度:</span>
        <mars-input-number @change="widthChange" v-model:value="widthValue" :min="0"></mars-input-number>(米)
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">河高度:</span>
        <mars-input-number @change="heightChange" v-model:value="heightValue"></mars-input-number>(米)
      </a-space>
    </div>

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">水流速:</span>
        <mars-slider @change="speedChange" v-model:value="speedValue" :min="0" :max="50" />{{ speedValue }}米/秒
      </a-space>
    </div>

    <div>
      <a-space>
        <span class="mars-pannel-item-label">方法演示:</span>
        <mars-button @click="addHeight">升高30米</mars-button>
        <mars-button @click="lowerHeight">降低30米</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import * as mapWork from "./map.js"

const activeKey = ref(["1", "2"])

// 绘制河流
const onClickStartDraw = () => {
  mapWork.startDrawGraphic()
}

// 点击表格开始编辑矢量数据的参数
const pannelTitle = ref<string>("")
const selectedGraphic = ref<boolean>(false)

function onStartEditor(data) {
  const graphic = mapWork.getGraphic(data.graphicId)
  pannelTitle.value = data.graphicName

  widthValue.value = graphic.width
  heightValue.value = graphic.height
  speedValue.value = graphic.speed

  selectedGraphic.value = true
}
function onStopEditor() {
  selectedGraphic.value = false
}

// 宽度
const widthValue = ref<number>(280)
const widthChange = () => {
  mapWork.widthChange(widthValue.value)
}

// 高度
const heightValue = ref<number>(30)
const heightChange = () => {
  mapWork.heightChange(Number(heightValue.value))
}

// 流速
const speedValue = ref<number>(10)
const speedChange = () => {
  mapWork.speedChange(speedValue.value)
}

// 升高
const addHeight = () => {
  mapWork.addHeight()
}

// 降低
const lowerHeight = () => {
  mapWork.lowerHeight()
}
</script>
<style scoped lang="less">
.ant-slider {
  width: 100px;
}

:deep(.ant-input-number-input) {
  width: 100px !important;
}
</style>
