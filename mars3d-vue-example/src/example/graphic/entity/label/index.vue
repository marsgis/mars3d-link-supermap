<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state />

    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">方法演示:</span>
        <mars-button @click="onClickStartBounce">开始弹跳</mars-button>
        <mars-button @click="onClickStartBounce2">开始弹跳（自动停止）</mars-button>
        <mars-button @click="onClickStopBounce">停止弹跳</mars-button>
      </a-space>
    </div>
  </mars-dialog>

  <location-to />
</template>

<script setup lang="ts">
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import * as mapWork from "./map.js"

const onClickStartBounce = () => {
  mapWork.onClickStartBounce()
}
const onClickStartBounce2 = () => {
  mapWork.onClickStartBounce2()
}
const onClickStopBounce = () => {
  mapWork.onClickStopBounce()
}
</script>
