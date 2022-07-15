<template>
  <mars-dialog :visible="true" right="10" top="10" width="300">
    <a-space>
      <mars-button @click="addGaodeLayer">高德交通态势图</mars-button>
      <mars-button @click="addBaiduLayer">百度交通态势图</mars-button>
    </a-space>

    <tile-layer-state />
  </mars-dialog>
</template>

<script setup lang="ts">
import TileLayerState from "@mars/components/mars-sample/tile-layer-state.vue"
import { onMounted } from "vue"
import * as mapWork from "./map.js"
import { useWidget } from "@mars/widgets/common/store/widget"

const { activate } = useWidget()
onMounted(() => {
  activate("query-poi")
})

const addGaodeLayer = () => {
  mapWork.addGaodeLayer()
}

const addBaiduLayer = () => {
  mapWork.addBaiduLayer()
}
</script>
