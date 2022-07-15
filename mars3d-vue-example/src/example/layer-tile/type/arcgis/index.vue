<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <tile-layer-state :interaction="true" />
  </mars-dialog>
</template>

<script setup lang="ts">
import TileLayerState from "@mars/components/mars-sample/tile-layer-state.vue"
</script>
