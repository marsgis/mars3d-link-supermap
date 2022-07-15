<template>
  <mars-dialog :visible="true" right="10" top="10" bottom="110" width="270">
    <div class="f-mb infoView-content">
      <a-space>
        <span>模型列表： </span>
        <a-upload :multiple="false" name="file" accept="json,geojson" :showUploadList="false" @change="openGeoJSON" :beforeUpload="() => false">
          <i title="打开GeoJSON文件"><mars-icon icon="folder-upload" width="19" /></i>
        </a-upload>
        <i title="保存GeoJSON"><mars-icon icon="disk" width="17" color="#f2f2f2" @click="saveGeoJSON" /></i>
        <i title="删除"><mars-icon icon="delete" width="17" color="#f2f2f2" @click="deleteMoXin" /></i>
      </a-space>
    </div>

    <div class="f-mb f-tac">
      <a-checkbox @change="chkTestTerrain" v-model:checked="isTestTerrain" title="深度检测">深度检测</a-checkbox>
      <a-checkbox @change="onlyPickModelPosition" v-model:checked="isonlyModel">仅在Tiles上拾取</a-checkbox>
    </div>

    <div class="f-mb">
      <mars-select
        ref="select"
        v-model:value="value1"
        style="width: 93%; margin-left: 5px"
        :options="selectOptions"
        @change="handleChange"
        class="mars-select_bottom"
      ></mars-select>

      <div class="gltfImg">
        <ul>
          <li v-for="imgs in dataList" :key="imgs.name">
            <img :src="imgs.image" alt="" @click="showModel(imgs.style)" />
          </li>
        </ul>
      </div>
    </div>
  </mars-dialog>
  <location-to />
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted } from "vue"
import { useWidget } from "@mars/widgets/common/store/widget"
import LocationTo from "@mars/components/mars-sample/location-to.vue"
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

// 深度检测
const isTestTerrain = ref<boolean>(false)
const chkTestTerrain = () => {
  mapWork.chkTestTerrain(isTestTerrain.value)
}

// 仅在模型上绘制
const isonlyModel = ref<boolean>(false)
const onlyPickModelPosition = () => {
  mapWork.onlyPickModelPosition(isonlyModel.value)
}

// 绘制模型
const showModel = (style: any) => {
  mapWork.startDrawModel(style)
}

//* **********************下拉框******************* */
let modelData: any
const selectOptions = ref<any[]>([])
const value1 = ref<string>("车辆")
const dataList = ref<any[]>([])

mapWork.eventTarget.on("loadModelList", function (event: any) {
  modelData = event.data
  // 下拉框数据
  Object.keys(modelData).forEach((k) => {
    selectOptions.value.push({
      value: k,
      lable: k
    })
  })
  handleChange()
})
// 下拉框改变
const handleChange = () => {
  dataList.value = modelData[value1.value]

  for (let i = 0; i < dataList.value.length; i++) {
    const item = dataList.value[i]

    item.image = mapWork.changeItemImage(item)
    item.style.url = mapWork.changeItemUrl(item)
    dataList.value[i] = item
  }
}

// ************************JSON文件************************/
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

// ************************属性面板************************/

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

const deleteMoXin = () => {
  mapWork.deleteAll()
}
</script>
<style scoped lang="less">
.infoView-content {
  height: 20px;
  width: 210px;
  line-height: 20px;
  background-color: rgba(32, 42, 68, 0.5);
  overflow: hidden;
}

.gltfImg {
  width: 100%;
  height: 100%;
  max-height: 752px;
  overflow-y: auto;
}

.gltfImg ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.gltfImg li {
  padding: 6px 7px;
}

.gltfImg img {
  width: 100px;
  height: 90px;
  border: 1.5px solid white;
}
.ant-upload {
  line-height: 0 !important;
}
// 让下拉选择框与下面的图片展示区有一个空隙
.mars-select_bottom {
  margin-bottom: 10px;
}
</style>
