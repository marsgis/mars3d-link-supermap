<template>
  <mars-dialog right="10" :visible="true">
    <a-form>
      <a-form-item label="方式">
        <mars-select v-model:value="selectWay" :options="selectWayOptions" @change="onHiddenRoam"> </mars-select>
      </a-form-item>

      <a-form-item label="起点">
        <a-space>
          <mars-input v-model:value="strat" disabled></mars-input>
          <mars-button @click="startPoint">选点</mars-button>
        </a-space>
      </a-form-item>
      <a-form-item label="终点">
        <a-space>
          <mars-input v-model:value="end" disabled></mars-input>
          <mars-button @click="endPoint">选点</mars-button>
        </a-space>
      </a-form-item>

      <a-space>
        <!-- <mars-button @click="btnAnalyse">开始分析</mars-button> -->
        <mars-button @click="removeAll">清除</mars-button>
        <mars-button @click="saveGeoJSON">保存GeoJSON</mars-button>
      </a-space>

      <div v-if="allDiatance" class="showRoam">
        <p style="color: #cad1d1">总距离：{{ allDiatance }}</p>
        <p style="color: #cad1d1">预计时间：{{ useTime }}</p>
        <p style="color: #cad1d1">导航：{{ routePath }}</p>
      </div>
    </a-form>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as mapWork from "./map.js"

const strat = ref("")
const end = ref("")
const selectWay = ref("1")
const allDiatance = ref("")
const useTime = ref("")
const routePath = ref("")

// 下拉菜单
const selectWayOptions = ref([
  {
    // 1-步行路线
    value: "1",
    label: "步行路线查询"
  },
  {
    // 2-行车路线
    value: "3",
    label: "驾车路线查询"
  }
])

const onHiddenRoam = () => {
  if (strat.value && end.value) {
    mapWork.btnAnalyse(selectWay.value)
  }
}
mapWork.eventTarget.on("analyse", function (event: any) {
  useTime.value = event.allTime
  allDiatance.value = event.allDistance
  routePath.value = event.dhHtml
})

// 起点
const startPoint = async () => {
  strat.value = await mapWork.startPoint(selectWay.value)
}

// 终点
const endPoint = async () => {
  end.value = await mapWork.endPoint(selectWay.value)
}

// 开始分析
const btnAnalyse = () => {
  mapWork.btnAnalyse(selectWay.value)
}

// 清除数据
const removeAll = () => {
  mapWork.removeAll()
  strat.value = ""
  end.value = ""
  allDiatance.value = ""
  useTime.value = ""
  routePath.value = ""
}

// 保存GeoJSON
const saveGeoJSON = () => {
  mapWork.saveGeoJSON()
}
</script>

<style lang="less">
// 原本加在mars-dialog上的，但是会造成dialog宽度过大，所以将这个样式从dialog上移除
.gaodeRoutePannel {
  right: 10px !important;
  top: 10px !important;
  max-height: calc(100% - 51px) !important;
  overflow: auto !important;
}
</style>
<style scoped lang="less">
.showRoam {
  top: 250px;
  word-break: break-all;
  width: 290px;
  padding: 5px;
  line-height: 25px;
}
.ant-select {
  width: 250px;
}
</style>
