<template>
  <mars-dialog :visible="true" right="10" top="10" height="44px">
    <a-radio-group @change="shadingMaterials" v-model:value="radioValue">
      <a-radio :value="1">更换中键和右键 </a-radio>
      <a-radio :value="2">Cesium操作习惯</a-radio>
    </a-radio-group>
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import { ref } from "vue"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import * as mapWork from "./map.js"

const radioValue = ref<number>(1)

const shadingMaterials = () => {
  mapWork.shadingMaterials(radioValue.value)
}
</script>
