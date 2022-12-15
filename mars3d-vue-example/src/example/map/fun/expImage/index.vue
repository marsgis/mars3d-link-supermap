<template>
  <mars-dialog :visible="true" right="10" top="10" width="220">
    <mars-button @click="showMapImg">查看场景出图(弹窗)</mars-button>

    <mars-button @click="downLoad">下载场景出图</mars-button>
    <mars-button @click="downLoad2">下载场景缩略图</mars-button>

    <mars-button @click="downLoadDiv">下载场景出图(含DIV部分)</mars-button>

    <img class="f-mb" :src="imges" v-if="showScreenShot" style="width: 100%; height: 100%" />
    <mars-button @click="screenShots">截缩略图</mars-button>
  </mars-dialog>

  <mars-dialog left="100" right="100" top="50" bottom="60" title="场景出图" v-model:visible="showImg">
    <img :src="imges" style="width: 100%; height: 100%" />
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const showImg = ref<boolean>(false)
const showScreenShot = ref<boolean>(false)

const imges = ref()

const showMapImg = () => {
  mapWork.showMapImg().then((image) => {
    imges.value = image
    showImg.value = true
  })
}

const downLoad = () => {
  mapWork.downLoad()
}
const downLoad2 = () => {
  mapWork.downLoad2()
}

const downLoadDiv = () => {
  mapWork.downLoadDiv()
}

// 截图
const screenShots = () => {
  showScreenShot.value = true
  mapWork.showMapImg({ width: 200, height: 200 }).then((image) => {
    imges.value = image
  })
}
</script>
<style scoped lang="less">
.mars-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
