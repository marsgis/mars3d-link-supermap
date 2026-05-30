<template>
  <mars-dialog :nopadding="true" title="属性编辑" width="315" top="60" bottom="40" left="10" :minWidth="200">
    <div class="top-handle-bar">
      <a-space>
        <mars-icon icon="send" width="20" @click="flyToGraphic" title="飞行定位"></mars-icon>
        <mars-icon icon="delete" width="20" @click="deleteEntity" title="删除"></mars-icon>
        <mars-icon icon="save" width="20" @click="getJson" title="导出JSON"></mars-icon>
        <mars-icon v-if="showMoveBtn" icon="play-two" width="20" @click="startMove" title="开始漫游"></mars-icon>
      </a-space>
    </div>
    <div class="attr-editor-main">
      <template v-if="activeTab === 'style' && graphicType">

        <template v-if="!styleParArr.length">
          <mars-styles v-model:style="style" :customType="customType" :graphicType="graphicType"
            @styleChange="styleChange" />
        </template>

        <template v-else>
          <mars-styles :graphicType="graphicType" v-model:style="style" isParent @styleChange="styleChange" />
          <template v-for="(item, index) in styleParArr" :key="index">
            <div v-if="typeof item === 'string'">
              <mars-styles :graphicType="item" :parentType="graphicType" v-model:style="style[item]"
                @styleChange="styleChange" />
            </div>
          </template>
        </template>
      </template>


      <mars-baseinfo v-if="activeTab === 'baseInfo'" :data="graphicOptions" @base-change="baseChange" />
    </div>
    <template #footer>
      <a-tabs v-model:activeKey="activeTab" centered type="card" tabPosition="bottom" @change="tabChange">
        <a-tab-pane key="style" tab="样式"></a-tab-pane>
        <a-tab-pane key="baseInfo" tab="基础"></a-tab-pane>
      </a-tabs>
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue"
import localforage from "localforage"
import MarsStyles from "./mars-styles.vue"
import MarsBaseinfo from "./mars-baseinfo.vue"
import * as mapWork from "./map"
import useLifecycle from "@mars/widgets/common/uses/use-lifecycle"
import { $message } from "@mars/components/mars-ui/index"
import { useWidget } from "@mars/widgets/common/store/widget"
import { aloneTypeStyle } from "@mars/utils/mars-util"

const { currentWidget } = useWidget()

const activeTab = ref("style") // 卡片所处位置

const tabChange = (item: any) => {
  localforage.setItem("active-tab", item)
}

const customType = ref("")
const graphicType = ref("")

const style = ref(null)
// 多个类型作为参数设置的矢量,如fixedRoute
const styleParArr = ref<string[]>([])

const graphicOptions = ref(null)
// 启用map.ts生命周期
useLifecycle(mapWork)

onMounted(() => {
  initGraphicItem(currentWidget.data.layerId, currentWidget.data.graphicId)
  setMoveBtn()
})

if (currentWidget) {
  currentWidget.onUpdate((event) => {
    if (event.graphicId) {
      graphicType.value = null
      nextTick(() => {
        initGraphicItem(event.layerId, event.graphicId)
        setMoveBtn()
      })
    }
  })
}

let graphicData: any
// 监听到矢量数据发生变化
function initGraphicItem(layerId, graphicId) {
  graphicData = mapWork.getGraphicOptions(layerId, graphicId)
  if (!graphicData) {
    return
  }

  // =====style===========
  style.value = graphicData.style ?? {}

  const paraArr = aloneTypeStyle[graphicData.type]
  if (paraArr && paraArr.length) {
    styleParArr.value = paraArr
    paraArr.forEach((typeItem) => {
      const typeData = graphicData[typeItem]

      if (typeof typeItem !== "string" && typeItem.length) {
        typeItem.forEach((item) => {
          style.value[item] = graphicData[item]
        })
      } else if (typeData) {
        style.value[typeItem] = { ...typeData }
      }
    })
  }

  // =====其他参数===========
  graphicType.value = graphicData.type
  customType.value = currentWidget.data.styleType || graphicData.styleType

  graphicOptions.value = graphicData
}

function styleChange(newStyle: any) {

  if (styleParArr.value?.length) {
    mapWork.setGraphicOptions({ ...newStyle })
  } else {
    mapWork.setGraphicOptions({ style: { ...newStyle } })
    console.log("修改了style样式", newStyle)
  }
}

// 基础信息修改
function baseChange(obj: any) {
  mapWork.setGraphicOptions({ ...obj })

  graphicOptions.value = { ...graphicOptions.value, ...obj }
}

// *********************  删除定位保存文件方法  ******************* //
function getJson() {
  const json = mapWork.graphic.toJSON() // 文件处理
  mapWork.downloadFile("标绘item.json", JSON.stringify(json))
}

function flyToGraphic() {
  mapWork.graphic.flyTo() // 事件处理
}

function deleteEntity() {
  mapWork.graphic.remove() // 删除
}

function startMove() {
  $message("开始漫游")
  // @ts-ignore
  mapWork.graphic.start()
}

const showMoveBtn = ref(false)
function setMoveBtn() {
  // @ts-ignore
  if (mapWork.graphic?.start) {
    showMoveBtn.value = true
  } else {
    showMoveBtn.value = false
  }
}

</script>
<style lang="less">
.top-handle-bar {
  border-bottom: 1px solid #cde1de;
  padding: 5px 0 2px 12px;

  .mars-icon {
    cursor: pointer;
  }
}

.attr-editor-main {
  // 编辑面板高度问题
  height: calc(100% - 70px);
  overflow-y: auto;

  * {
    font-size: 12px;
    color: #ffffff;
  }

  .ant-tabs-nav {
    margin: 0;
  }

  .ant-select,
  .ant-input-number {
    width: 100%;
  }
}
</style>
