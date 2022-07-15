<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="1" header="景点视角:">
        <a-space>
          <mars-button @click="changeView1">故宫</mars-button>
          <mars-button @click="changeView2">珠峰</mars-button>
          <mars-button @click="changeView3">华山</mars-button>
          <mars-button @click="changeView4">大别山</mars-button>
        </a-space>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="相机和视角控制演示:" class="cameraView">
        <a-space>
          <div v-for="(item, index) in cameraData" :key="index">
            <mars-button :title="item.title" @click="item.callback">{{ item.name }}</mars-button>
          </div>
        </a-space>
      </a-collapse-panel>
    </a-collapse>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, markRaw } from "vue"
import * as mapWork from "./map.js"

const activeKey = ref(["1", "2", "3"])

onMounted(() => {
  mapWork.map.on("cameraChanged", function (event) {
    console.log("视角发送了变化", mapWork.map.getCameraView())
  })
})

// **************************** 景点视角演示********************** //
const changeView1 = () => {
  mapWork.changeView1()
}
const changeView2 = () => {
  mapWork.changeView2()
}
const changeView3 = () => {
  mapWork.changeView3()
}
const changeView4 = () => {
  mapWork.changeView4()
}

// **************************** 相机和视角控制********************** //
const cameraData = [
  {
    name: "获取当前地图视角",
    title: "",
    callback: () => mapWork.mapGetCameraView()
  },
  {
    name: "停止视角定位",
    title: "",
    callback: () => mapWork.mapCancelFlyTo()
  },
  {
    name: "飞行至默认视角",
    title: "默认视角一般为config.json中的center参数配置的视角",
    callback: () => mapWork.mapFlyHome()
  },
  {
    name: "定位至指定位置",
    title: "",
    callback: () => mapWork.mapSetCameraView()
  },

  {
    name: "定位至矩形区域处",
    title: "",
    callback: () => mapWork.mapFlyToExtent()
  },
  {
    name: "定位至目标点",
    title: "",
    callback: () => mapWork.mapFlyToPoint()
  },
  {
    name: "定位至坐标数组处",
    title: "",
    callback: () => mapWork.mapFlyToPositions()
  },
  {
    name: "定位至矢量数据",
    title: "",
    callback: () => mapWork.mapFlyToGraphic()
  },

  {
    name: "按序播放多个相机位置",
    title: "",
    callback: () => mapWork.mapSetCameraViewList()
  }
]
</script>
<style lang="less" scoped>
.cameraView {
  width: 270px;
  .ant-space {
    flex-wrap: wrap;
  }
}
</style>
