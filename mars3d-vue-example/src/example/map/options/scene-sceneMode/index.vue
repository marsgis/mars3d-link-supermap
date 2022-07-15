<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-radio-group
      optionType="button"
      buttonStyle="solid"
      :options="options"
      v-model:value="radioValue"
      @change="
        (e) => {
          changeBackground(e.target.value)
        }
      "
    />
  </mars-dialog>
</template>

<script setup lang="ts">
import * as mapWork from "./map.js"
import { ref } from "vue"

const radioValue = ref("2")
const options = [
  { label: "切换为二维视图", value: "1" },
  { label: "切换为三维视图", value: "2" },
  { label: "切换为2.5D维视图", value: "3" }
]

const changeBackground = (e) => {
  switch (e) {
    case "1":
      mapWork.to2d()
      break
    case "2":
      mapWork.to3d()
      break
    case "3":
      mapWork.toGLB()
      break
  }
}
</script>
