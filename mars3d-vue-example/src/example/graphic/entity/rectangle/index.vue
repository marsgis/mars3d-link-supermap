<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state drawLabel1="绘制矩形" drawLabel2="绘制立体矩形" />
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
</script>
