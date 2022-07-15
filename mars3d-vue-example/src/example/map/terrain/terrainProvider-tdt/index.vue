<template>
  <mars-dialog :visible="true" right="10" top="10" height="46px">
    <a-checkbox v-model:checked="onCheckedTriangulation" @change="formStateChange">地形三角网</a-checkbox>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const onCheckedTriangulation = ref<boolean>(false)

const formStateChange = () => {
  mapWork.checkedTriangulation(onCheckedTriangulation.value)
}
</script>
