<template>
  <mars-dialog :visible="true" right="10" bottom="60" width="230" >
    <a-form>
      <a-row :gutter="[0, 8]">
        <a-col :span="12">总长度:</a-col>
        <a-col :span="12">{{ formState.td_alllength }}</a-col>

        <a-col :span="12">已漫游长度:</a-col>
        <a-col :span="12">{{ formState.td_length }}</a-col>

        <a-col :span="12">总时长:</a-col>
        <a-col :span="12">{{ formState.td_alltimes }}</a-col>

        <a-col :span="12">已漫游时间:</a-col>
        <a-col :span="12">{{ formState.td_times }}</a-col>

        <a-col :span="12">经度:</a-col>
        <a-col :span="12">{{ formState.td_jd }}</a-col>

        <a-col :span="12">纬度:</a-col>
        <a-col :span="12">{{ formState.td_wd }}</a-col>

        <a-col :span="12">漫游高程:</a-col>
        <a-col :span="12">{{ formState.td_gd }}</a-col>
        <a-progress :percent="formState.percent" size="small" color="#fff" />
      </a-row>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
/**
 * 公共组件：飞行漫游路线公共面板
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import { onMounted, reactive } from "vue"
import type { UnwrapRef } from "vue"

interface FormState {
  td_alllength: string
  td_length: string
  td_alltimes: string
  td_times: string
  td_jd: string
  td_wd: string
  td_gd: string
  percent: number
}

// mapWork是map.js内定义的所有对象， 在项目中使用时可以改为import方式使用:  import * as mapWork from './map.js'
const mapWork = window.mapWork
// const mars3d = mapWork.mars3d
// const Cesium = mapWork.Cesium

const formState: UnwrapRef<FormState> = reactive({
  td_alllength: "",
  td_length: "",
  td_alltimes: "",
  td_times: "",
  td_jd: "",
  td_wd: "",
  td_gd: "",
  percent: 0
})

onMounted(() => {
  if (mapWork.fixedRoute?.info) {
    showInfo(mapWork.fixedRoute.info)
  }
  mapWork.eventTarget.on("roamLineChange", (item: any) => {
    showInfo(item)
  })
})

function showInfo(item: any) {
  let val = Math.ceil((item.second * 100) / item.second_all)
  if (val < 1) {
    val = 1
  }
  if (val > 100) {
    val = 100
  }
  formState.percent = val

  formState.td_jd = item.point?.lng
  formState.td_wd = item.point?.lat
  formState.td_gd = mapWork.formatDistance(item.point?.alt)
  formState.td_times = mapWork.formatTime(item.second)
  formState.td_alltimes = mapWork.formatTime(item.second_all)
  formState.td_length = mapWork.formatDistance(item.distance) || "0米"
  formState.td_alllength = mapWork.formatDistance(item.distance_all)
}
</script>
<style scoped lang="less">
:deep(.info-view) {
  width: 200px;
  top: auto !important;
  bottom: 60px;
  overflow-y: hidden;
  z-index: 0 !important;
}

:deep(.ant-progress-text) {
  color: #fff;
}
</style>
