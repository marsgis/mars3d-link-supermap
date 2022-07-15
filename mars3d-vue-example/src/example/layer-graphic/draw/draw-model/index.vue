<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <span>模型URL地址: </span> &nbsp;&nbsp;
      <a-checkbox v-model:checked="isProxy">使用代理</a-checkbox>
      <mars-input v-model:value="modelUrl"></mars-input>
    </div>
    <div class="f-mb">
      <a-space>
        <mars-button @click="onClickStartDarw">标绘</mars-button>
        <mars-button @click="clear">清除</mars-button>
        <mars-button @click="saveGeoJSON">保存</mars-button>
        <a-upload :multiple="false" name="file" accept="json,geojson" :showUploadList="false" @change="openGeoJSON" :beforeUpload="() => false">
          <mars-button> 打开... </mars-button>
        </a-upload>
      </a-space>
      <div class="f-pt">
        <a-space>
          <a-checkbox @change="chkTestTerrain" v-model:checked="isTestTerrain">深度检测</a-checkbox>
          <a-checkbox @change="onlyPickModelPosition" v-model:checked="isonlyModel">仅在Tiles上拾取</a-checkbox>
          <a-checkbox @change="chkHasTerrain" v-model:checked="isHasTerrain">地形</a-checkbox>
        </a-space>
      </div>
    </div>
  </mars-dialog>

  <location-to />
</template>

<script lang="ts" setup>
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import { ref, markRaw, onMounted } from "vue"
import { useWidget } from "@mars/widgets/common/store/widget"
import * as mapWork from "./map.js"

interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}

const modelUrl = ref<string>("//data.mars3d.cn/gltf/mars/feiji.glb")

// 代理
const isProxy = ref<boolean>(false)
const onClickStartDarw = () => {
  mapWork.startDrawModel(modelUrl.value, isProxy.value)
}

// 地形
const isHasTerrain = ref<boolean>(true)
const chkHasTerrain = () => {
  mapWork.chkHasTerrain(isHasTerrain.value)
}

// 深度检测
const isTestTerrain = ref<boolean>(false)
const chkTestTerrain = () => {
  mapWork.chkTestTerrain(isTestTerrain.value)
}

// 仅在3dmodel上绘制
const isonlyModel = ref<boolean>(false)
const onlyPickModelPosition = () => {
  mapWork.onlyPickModelPosition(isonlyModel.value)
}

const clear = () => {
  mapWork.graphicLayer.clear()
}

// *****************************JSON文件***************************//
// const globalProperties = getCurrentInstance()!.appContext.config.globalProperties

// 打开JSON
const openGeoJSON = (info: FileInfo) => {
  mapWork.openGeoJSON(info.file)
}
// 点击保存GeoJSON
const saveGeoJSON = () => {
  mapWork.saveGeoJSON()
}

// *****************************属性面板***************************//
// 数据编辑属性面板 相关处理
const { activate, disable, isActivate, updateWidget } = useWidget()
onMounted(() => {
  const mars3d = window.mapWork.mars3d
  // 矢量数据创建完成
  mapWork.graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    showEditor(e)
  })
  // 修改了矢量数据
  mapWork.graphicLayer.on(
    [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
    function (e) {
      showEditor(e)
    }
  )
  // 停止编辑
  mapWork.graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    setTimeout(() => {
      if (!mapWork.graphicLayer.isEditing) {
        disable("graphic-editor")
      }
    }, 100)
  })
})

const showEditor = (e: any) => {
  const graphic = e.graphic
  if (!graphic._conventStyleJson) {
    graphic.options.style = graphic.toJSON().style // 因为示例中的样式可能有复杂对象，需要转为单个json简单对象
    graphic._conventStyleJson = true // 只处理一次
  }

  if (!isActivate("graphic-editor")) {
    activate({
      name: "graphic-editor",
      data: {
        graphic: markRaw(graphic)
      }
    })
  } else {
    updateWidget("graphic-editor", {
      data: {
        graphic: markRaw(graphic)
      }
    })
  }
}
</script>
