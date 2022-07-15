<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space> 显示每层颜色:<mars-switch v-model:checked="checked" @change="chkShowColor" /> </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const checked = ref(true)

const chkShowColor = () => {
  mapWork.chkShowColor(checked.value)
}
</script>
