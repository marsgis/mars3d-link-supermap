<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="f-mb">
      <a-space>
        <a-radio-group @change="modeChange" v-model:value="value" name="radioGroup">
          <a-radio value="1">编辑模式</a-radio>
          <a-radio value="2">预览模式</a-radio>
        </a-radio-group>
      </a-space>
    </div>

    <div v-if="value === '1'">
      <a-space>
        <mars-button @click="drawPolygon">单体化面</mars-button>
        <a-upload :multiple="false" name="file" accept="json,geojson" :showUploadList="false" :beforeUpload="() => false" @change="openGeoJSON">
          <mars-button> 打开</mars-button>
        </a-upload>
        <mars-button @click="saveGeoJSON">保存</mars-button>
        <mars-button @click="clear">清除</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted } from "vue"
import * as mapWork from "./map.js"
import { useWidget } from "@mars/widgets/common/store/widget"

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

// 单体化面
const drawPolygon = () => {
  mapWork.drawPolygon()
}

const clear = () => {
  mapWork.deleteAll()
}

// 模式发生改变
const value = ref<string>("1")
const modeChange = () => {
  if (value.value === "1") {
    mapWork.toBJMS()
  } else {
    mapWork.toYLMS()
  }
}

// 打开
const openGeoJSON = (info: FileInfo) => {
  const item = info.file
  const fileName = item.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
  if (fileType !== "json") {
    alert("文件类型不合法,请选择json格式标注文件！")
  }

  mapWork.openGeoJSON(item)
}

// 点击保存GeoJSON
const saveGeoJSON = () => {
  mapWork.saveGeoJSON()
}

//* ************************属性面板*****************************/
// 数据编辑属性面板 相关处理
const { activate, disable, isActivate, updateWidget } = useWidget()
onMounted(() => {
  const mars3d = window.mapWork.mars3d
  // 矢量数据创建完成
  mapWork.graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    if (value.value === "1") {
      showEditor(e)
    }
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
