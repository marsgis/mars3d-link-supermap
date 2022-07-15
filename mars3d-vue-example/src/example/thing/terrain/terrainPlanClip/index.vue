<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-form>
      <div class="f-mb">
        <a-space>
          <a-checkbox v-model:checked="formState.enabledWadi" @change="chkClippingPlanes"> 是否挖地 </a-checkbox>
          <a-checkbox v-model:checked="formState.enabledWaiqiege" @change="chkUnionClippingRegions"> 是否外切割 </a-checkbox>
          <a-checkbox v-model:checked="formState.enabledShendu" @change="chkTestTerrain"> 深度检测 </a-checkbox>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span>开挖深度:</span>
          <mars-input-number v-model:value="formState.txtHeight" @change="changeClipHeight" :step="1" :min="-500" :max="999" />
          <span>（米）</span>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <mars-button @click="btnDrawExtent">添加矩形</mars-button>
          <mars-button @click="btnDraw">添加多边行</mars-button>
          <mars-button @click="removeAll">清除</mars-button>
        </a-space>
      </div>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue"
import type { UnwrapRef } from "vue"
import * as mapWork from "./map.js"

interface FormState {
  enabledWadi: boolean
  enabledWaiqiege: boolean
  enabledShendu: boolean
  txtHeight: number
}

const formState: UnwrapRef<FormState> = reactive({
  enabledWadi: true,
  enabledWaiqiege: false,
  enabledShendu: true,
  txtHeight: 30
})

onMounted(() => {
  mapWork.addLayer(formState.txtHeight)
})

// 是否挖地
const chkClippingPlanes = () => {
  mapWork.chkClippingPlanes(formState.enabledWadi)
}

// 是否外切割
const chkUnionClippingRegions = () => {
  mapWork.chkUnionClippingRegions(formState.enabledWaiqiege)
}

// 深度检测
const chkTestTerrain = () => {
  mapWork.chkTestTerrain(formState.enabledShendu)
}

// 添加矩形
const btnDrawExtent = () => {
  mapWork.btnDrawExtent()
}

// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw()
}

// 清除
const removeAll = () => {
  mapWork.removeAll()
  // 是否挖地和外切割
  formState.enabledWaiqiege = false
  formState.enabledWadi = true
}

// 改变切割的深度
const changeClipHeight = () => {
  mapWork.changeClipHeight(formState.txtHeight)
}
</script>
<style scoped lang="less">
.ant-input-number {
  width: 100px !important;
}
</style>
