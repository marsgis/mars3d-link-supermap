<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state ref="graphicLayerStateRef" />
  </mars-dialog>
</template>

<script setup lang="ts">
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import * as mapWork from "./map.js"
import { ref } from "vue"

const graphicLayerStateRef = ref()
let graphicLayer: any

mapWork.eventTarget.on("addTableData", function (event: any) {
  graphicLayer = event.graphicLayer
  graphicLayerStateRef.value.addTableData(graphicLayer)
})
</script>
