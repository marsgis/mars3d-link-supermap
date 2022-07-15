<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state :defaultCount="100" />
    <span style="color: #ccc">建议：绘制时顺着道路方向选点，直线时多采集点</span>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
</script>
