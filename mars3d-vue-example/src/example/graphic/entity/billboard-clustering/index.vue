<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <a-checkbox v-model:checked="enabledAggressive" @change="formStateChange">是否聚合</a-checkbox>

      <mars-button title="贴地属性性能较低，建议异步计算后将高度值存放数据库内，后期直接加载此高度值" @click="getDataSurfaceHeight">
        演示异步计算贴地高度
      </mars-button>
    </a-space>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

// mapWork是map.js内定义的所有对象， 在项目中使用时可以改为import方式使用:  import * as mapWork from './map.js'
const mapWork = window.mapWork || {}

const enabledAggressive = ref(true)

const formStateChange = () => {
  mapWork.enabledAggressive(enabledAggressive.value)
}

const getDataSurfaceHeight = () => {
  mapWork.getDataSurfaceHeight()
}
</script>
