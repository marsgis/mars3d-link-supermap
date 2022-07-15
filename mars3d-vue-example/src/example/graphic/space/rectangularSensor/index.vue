<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state :defaultCount="100" :interaction="false" />
  </mars-dialog>
</template>

<script lang="ts" setup>
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
</script>
