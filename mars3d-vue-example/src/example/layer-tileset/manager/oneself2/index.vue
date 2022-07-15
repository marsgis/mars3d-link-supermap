<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <span class="mars-pannel-item-label">模型URL:</span>
        <mars-input v-model:value="url"></mars-input>
        <mars-button @click="showModel">加载模型</mars-button>
      </a-space>
    </div>

    <a-form>
      <a-form-item label="视角复位">
        <mars-button @click="flyTo">视角定位至模型</mars-button>
      </a-form-item>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import * as mapWork from "./map.js"

const url = ref<any>()

onMounted(() => {
  // 历史记录模型地址
  const modelUrl = localStorage.getItem("onlyModel2")
  if (modelUrl) {
    url.value = modelUrl
  } else {
    url.value = "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json"
  }

  setTimeout(() => {
    mapWork.showModel(url.value)
  }, 500)
})

const showModel = () => {
  mapWork.showModel(url.value)
  localStorage.setItem("onlyModel2", url.value)
}
const flyTo = () => {
  mapWork.flyTo()
}
</script>
