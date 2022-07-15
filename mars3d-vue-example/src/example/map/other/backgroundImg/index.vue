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
const radioValue = ref("2")
const options = [
  { label: "无", value: "1" },
  { label: "背景1", value: "2" },
  { label: "背景2", value: "3" },
  { label: "背景3", value: "4" }
]

const changeBackground = (e) => {
  radioValue.value = e
  switch (e) {
    case "1":
      mapWork.show()
      break
    case "2":
      mapWork.show1()
      break
    case "3":
      mapWork.show2()
      break
    case "4":
      mapWork.show3()
      break
  }
}
</script>
