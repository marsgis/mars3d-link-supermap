<template>
  <mars-dialog :visible="true" right="10" top="10">
    <graphic-layer-state :defaultCount="1000"/>
 </mars-dialog>
  <location-to />
</template>
<script lang="ts" setup>
import GraphicLayerState from "@mars/components/mars-sample/graphic-layer-state.vue"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
</script>
