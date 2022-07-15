<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state :defaultCount="1000"/>
    <div>
      <a-space>
        <span class="mars-pannel-item-label">方法演示:</span>
        <mars-button @click="onClickSelPoint">追踪目标点</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"

import * as mapWork from "./map.js"

const onClickSelPoint = () => {
  mapWork.onClickSelPoint()
}
</script>
