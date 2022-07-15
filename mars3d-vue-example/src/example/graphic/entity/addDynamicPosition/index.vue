<template>
  <mars-dialog :visible="true" right="10" top="10">
    <layer-state />
    <mars-button href="editor-vue.html?id=graphic/entity/addDynamicPosition-tileset" target="_blank">动态贴模型示例</mars-button>
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import LayerState from "@mars/components/mars-sample/layer-state.vue"
</script>
