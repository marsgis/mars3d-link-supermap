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
import { ref } from "vue"
import * as mapWork from "./map.js"
const radioValue = ref("1")

const options = [
  { label: "晴天", value: "1" },
  { label: "晚霞", value: "2" },
  { label: "蓝天", value: "3" },
  { label: "默认", value: "4" }
]

const changeBackground = (e) => {
  switch (e) {
    case "1":
      mapWork.sunny()
      break
    case "2":
      mapWork.sunsetGlow()
      break
    case "3":
      mapWork.blueSky()
      break
    case "4":
      mapWork.defaultSky()
      break
  }
}
</script>
