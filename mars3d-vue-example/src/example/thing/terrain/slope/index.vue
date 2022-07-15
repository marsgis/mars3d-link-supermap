<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-form>
      <a-form-item label="插值数">
        <a-space>
          <mars-input-number v-model:value="txtSplitNum" :step="1" :min="1" :max="999" />
          <mars-button @click="btnDrawExtent">添加矩形</mars-button>
          <mars-button @click="btnDraw">添加多边形</mars-button>
          <mars-button @click="btnDrawPoint">添加点</mars-button>
          <mars-button @click="clearAll">清除</mars-button>
        </a-space>
      </a-form-item>

      <a-form-item label="地表渲染">
        <a-radio-group v-model:value="radio" @change="changeShadingType">
          <a-radio value="none">无阴影</a-radio>
          <a-radio value="slope">坡度</a-radio>
          <a-radio value="aspect">坡向</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue"
import * as mapWork from "./map.js"

const txtSplitNum = ref(10)
const radio = ref("none")

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent(toRaw(txtSplitNum.value))
}
// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw(toRaw(txtSplitNum.value))
}
// 添加点
const btnDrawPoint = () => {
  mapWork.btnDrawPoint()
}
// 清除
const clearAll = () => {
  mapWork.clearAll()
}

// 改变阴影
const changeShadingType = () => {
  mapWork.changeShadingType(toRaw(radio.value))
}
</script>
<style scoped lang="less">
.ant-input-number {
  width: 70px !important;
}
</style>
