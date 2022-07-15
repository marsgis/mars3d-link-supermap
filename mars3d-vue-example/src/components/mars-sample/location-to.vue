<template>
  <mars-dialog :visible="true" right="10" bottom="40">
    <a-space>
      <mars-button @click="onClickCenterAtTerrain">定位至山区</mars-button>
      <mars-button @click="onClickCenterAtModel">定位至模型</mars-button>
    </a-space>
  </mars-dialog>
</template>

<script>
/**
 * 公共组件：快捷定位
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import { defineComponent, ref } from "vue"

export default defineComponent({
  setup() {
    // mapWork是map.js内定义的所有对象， 在项目中使用时可以改为import方式使用:  import * as mapWork from './map.js'
    const mapWork = window.mapWork
    const mars3d = mapWork.mars3d
    const Cesium = mapWork.Cesium

    // let modelTest
    //  定位至山区
    const onClickCenterAtTerrain = () => {
      mapWork.map.setCameraView({ lat: 30.859414, lng: 116.28709, alt: 8617, heading: 18, pitch: -28 })
    }

    // 定位至模型
    let modelTest
    const onClickCenterAtModel = () => {
      const map = mapWork.map
      if (!modelTest) {
        modelTest = new mars3d.layer.TilesetLayer({
          url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
          position: { alt: 80.6 },
          maximumScreenSpaceError: 1,
          maximumMemoryUsage: 1024,
          flyTo: true
        })
        map.addLayer(modelTest)
      }
      map.setCameraView({ lat: 33.587396, lng: 119.03181, alt: 588, heading: 0, pitch: -45 })
    }

    return {
      onClickCenterAtTerrain,
      onClickCenterAtModel
    }
  }
})
</script>
<style lang="less" scoped>
.localBtn {
  top: auto;
  bottom: 40px;
  right: 10px;
}
</style>
