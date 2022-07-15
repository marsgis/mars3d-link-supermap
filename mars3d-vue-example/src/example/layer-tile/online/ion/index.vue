<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <tile-layer-state />
  </mars-dialog>
</template>

<script setup lang="ts">
import TileLayerState from "@mars/components/mars-sample/tile-layer-state.vue"
import { onMounted } from "vue"
import { useWidget } from "@mars/widgets/common/store/widget"
import * as mapWork from "./map.js"

const { activate } = useWidget()

onMounted(() => {
  activate("query-poi")
})
</script>
