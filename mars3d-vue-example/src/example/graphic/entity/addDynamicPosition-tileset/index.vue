<template>
  <mars-dialog :visible="true" right="10" top="10">
    <layer-state />
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import LayerState from "@mars/components/mars-sample/layer-state.vue"
</script>
