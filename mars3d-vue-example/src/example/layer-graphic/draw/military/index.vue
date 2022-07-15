<template>
  <mars-dialog :visible="true" right="10" top="10" width="362">
    <div class="f-mb">
      <a-row>
        <a-col :span="5">图层状态:</a-col>
        <a-col :span="19">
          <a-space>
            <a-checkbox v-model:checked="enabledShowHide" @change="onChangeShow">显示隐藏</a-checkbox>
            <a-checkbox v-model:checked="enabledPopup" @change="onChangePopup">Popup绑定</a-checkbox>
            <a-checkbox v-model:checked="enabledTooltip" @change="onChangeTooltip">Tooltip</a-checkbox>
            <a-checkbox v-model:checked="enabledRightMenu" @change="onChangeContextMenu">右键绑定</a-checkbox>
            <a-checkbox v-model:checked="isEditable" @change="isEditableChange">是否编辑</a-checkbox>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="f-mb">
      <a-row>
        <a-col :span="5">数据管理:</a-col>
        <a-col :span="19">
          <a-space>
            <mars-button @click="onClickClear">清除</mars-button>
            <mars-button @click="onClickExpFile">保存GeoJSON</mars-button>
            <a-upload
              :multiple="false"
              name="file"
              accept="json,geojson"
              :file-list="fileList"
              :showUploadList="false"
              :supportServerRender="true"
              :beforeUpload="() => false"
              @change="onClickImpFile"
            >
              <mars-button> 打开GeoJSON </mars-button>
            </a-upload>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <div class="f-mb">
      <a-row>
        <a-col :span="5">二维贴地:</a-col>
        <a-col :span="19">
          <a-space>
            <mars-button @click="drawPolygon('doubleArrow')">钳击箭头</mars-button>
            <mars-button @click="drawPolygon('closeVurve')">闭合曲面</mars-button>
            <mars-button @click="drawPolygon('attackArrow')">攻击箭头</mars-button>
            <mars-button @click="drawPolygon('gatheringPlace')">集结地</mars-button>
            <mars-button @click="drawPolygon('straightArrow')">粗直箭头</mars-button>
            <mars-button @click="drawPolygon('fineArrowYW')">燕尾直箭头</mars-button>
            <mars-button @click="drawPolygon('fineArrow')">粗单尖直箭头</mars-button>
            <mars-button @click="drawPolygon('attackArrowPW')">平尾攻击箭头</mars-button>
            <mars-button @click="drawPolygon('attackArrowYW')">燕尾攻击箭头</mars-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <div class="f-mb">
      <a-row>
        <a-col :span="5">三维贴地:</a-col>
        <a-col :span="19">
          <a-space>
            <mars-button @click="drawExtrudedPolygon('doubleArrow')">钳击箭头</mars-button>
            <mars-button @click="drawExtrudedPolygon('closeVurve')">闭合曲面</mars-button>
            <mars-button @click="drawExtrudedPolygon('attackArrow')">攻击箭头</mars-button>
            <mars-button @click="drawExtrudedPolygon('gatheringPlace')">集结地</mars-button>
            <mars-button @click="drawExtrudedPolygon('straightArrow')">粗直箭头</mars-button>
            <mars-button @click="drawExtrudedPolygon('fineArrowYW')">燕尾直箭头</mars-button>
            <mars-button @click="drawExtrudedPolygon('fineArrow')">粗单尖直箭头</mars-button>
            <mars-button @click="drawExtrudedPolygon('attackArrowPW')">平尾攻击箭头</mars-button>
            <mars-button @click="drawExtrudedPolygon('attackArrowYW')">燕尾攻击箭头</mars-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
  </mars-dialog>
  <location-to />
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted } from "vue"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
import { $message } from "@mars/components/mars-ui/index"
import { useWidget } from "@mars/widgets/common/store/widget"
import * as mapWork from "./map.js"


// 是否可编辑
const isEditable = ref(true)
const isEditableChange = () => {
  mapWork.graphicLayer.hasEdit = isEditable.value
}

// 显示隐藏
const enabledShowHide = ref(true)
const onChangeShow = () => {
  mapWork.graphicLayer.show = enabledShowHide.value
}

// 是否绑定Popup
const enabledPopup = ref(false)
const onChangePopup = () => {
  if (enabledPopup.value) {
    mapWork.bindLayerPopup()
  } else {
    mapWork.graphicLayer.unbindPopup()
  }
}

// 是否绑定Tooltip
const enabledTooltip = ref(false)
const onChangeTooltip = () => {
  if (enabledTooltip.value) {
    mapWork.graphicLayer.bindTooltip("我是layer上绑定的Tooltip")
  } else {
    mapWork.graphicLayer.unbindTooltip()
  }
}

// 是否绑定右键菜单
const enabledRightMenu = ref(true)
const onChangeContextMenu = () => {
  if (enabledRightMenu.value) {
    mapWork.bindLayerContextMenu()
  } else {
    mapWork.graphicLayer.unbindContextMenu(true)
  }
}

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

//  清除数据
const onClickClear = () => {
  mapWork.graphicLayer.clear()
}

// 保存geojson
const onClickExpFile = () => {
  if (mapWork.graphicLayer.length === 0) {
    $message("当前没有标注任何数据，无需保存！")
    return
  }
  mapWork.downloadJsonFile()
}
// 打开geojson
const onClickImpFile = (info: FileInfo) => {
  mapWork.openGeoJSON(info.file)
}

const fileList = ref([])

const drawPolygon = (type: any) => {
  mapWork.drawPolygon(type)
}
const drawExtrudedPolygon = (type: any) => {
  mapWork.drawExtrudedPolygon(type)
}

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
<style scoped lang="less">
:deep(.ant-space) {
  flex-wrap: wrap;
}
</style>
