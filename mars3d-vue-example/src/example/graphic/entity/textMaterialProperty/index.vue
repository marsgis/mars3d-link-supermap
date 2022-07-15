<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state drawLabel1="绘制墙" drawLabel2="绘制贴地矩形" />

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">其他绘制:</span>
        <mars-button title="根据中心点和长宽来计算矩形" @click="onClickDrawPoint">绘制点计算矩形</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import * as mapWork from "./map.js"

const onClickDrawPoint = () => {
  mapWork.onClickDrawPoint()
}
</script>
