<template>
  <div class="f-fr f-pdg-10-b">
    <mars-switch v-model:checked="formState.showTable" title="显示图层内所有矢量数据列表" />
    <span class="f-push-10-l">显示列表</span>
  </div>

  <!-- 使用表格实现界面 -->
  <div v-if="formState.showTable" class="tile-state">
    <mars-table class="mars-noHeader-table"
      :row-selection="tileLayerRowSelection"
      :dataSource="tileLayerList"
      :columns="tileLayerColumns"
      :showHeader="false"
      :bordered="false"
      :pagination="false"
      size="small"
      :customRow="tileLayerCustomRowObj">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'edit'">
          <div class="table-tools">
            <a-space>
              <mars-icon v-if="record.isTile" icon="editor" color="#f2f2f2" class="icon-vertical-a" title="修改图层参数"
                @click.stop="startEditingLayer(record)" />
              <mars-icon icon="delete" color="#F96868" class="icon-vertical-a" title="删除图层"
                @click.stop="deleteLayer(record)" />
            </a-space>
          </div>
        </template>
      </template>
    </mars-table>
  </div>

  <div class="layer-control">
    <a-space>
      <mars-button v-if="formState.hasAddTileLayer" @click="addTileLayer">添加图层</mars-button>
      <mars-button type="primary" danger v-if="formState.hasAddTileLayer" @click="removeTileLayer">移除图层</mars-button>
    </a-space>
  </div>

  <!-- 编辑图层的面板 -->
  <div class="property-content" v-if="formState.showTable && formState.layerName">
    <h2 class="title">{{ formState.layerName }}</h2>

    <!-- 图层状态、交互、操作的盒子 -->
    <div class="bottom-box">
      <!-- 图层状态 -->
      <div class="f-mb f-pt">
        <a-space>
          <span class="mars-pannel-item-label">状态:</span>
          <a-checkbox v-model:checked="formState.show" @change="onChangeShow" title="显示隐藏状态">显示</a-checkbox>
        </a-space>
      </div>

      <div class="f-mb">
        <mars-gui :options="options" labelCol="6"></mars-gui>
      </div>

      <!-- 图层交互 -->
      <div class="f-mb" v-if="props.interaction">
        <a-space>
          <span class="mars-pannel-item-label">图层交互:</span>
          <a-checkbox v-model:checked="formState.hasPopup" @change="onChangePopup"
            title="是否绑定Popup鼠标单击弹窗">单击Popup</a-checkbox>
          <a-checkbox v-model:checked="formState.hasHighlight" @change="onChangeHighlight"
            title="是否绑定单击高亮其对应矢量数据">单击高亮</a-checkbox>
        </a-space>
      </div>

      <!-- 图层操作 -->
      <!-- <div class="f-mb">
          <a-space>
            <span class="mars-pannel-item-label">图层操作:</span>

            <mars-button @click="onClickFlyTo" title="视角定位" >
              <mars-icon icon="aiming" class="icon-vertical-a" />
              视角定位
            </mars-button>

            <mars-button @click="removeLayer" title="删除图层">
              <mars-icon icon="delete" class="icon-vertical-a" />
              删除图层
            </mars-button>
          </a-space>
        </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"
import type { UnwrapRef } from "vue"

// mapWork是map.js内定义的所有对象， 在项目中使用时可以改为import方式使用:  import * as mapWork from './map.js'
const mapWork = window.mapWork
const mars3d = mapWork.mars3d

const props = withDefaults(
  defineProps<{
    interaction?: boolean // 是否可以鼠标拾取和交互
  }>(),
  {
    interaction: false
  }
)

interface FormState {
  show: boolean
  hasAddTileLayer: boolean
  hasPopup: boolean
  hasHighlight: boolean
  showTable: boolean // 控制列表的显示与隐藏
  layerName: string
}
const formState: UnwrapRef<FormState> = reactive({
  show: true,
  hasAddTileLayer: true,
  hasPopup: true,
  hasHighlight: true,
  showTable: true,
  layerName: ""
})

// 表格相关
interface LayerTableItem {
  key: number
  name: string
  isTile: boolean
}

const tileLayerList = ref([])
const rowKeys = ref<string[]>([])


watch(() => rowKeys.value, () => {
  formState.show = rowKeys.value.includes(thisLayer?.id)
})


const tileLayerColumns = ref([
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    align: "center"
  },
  {
    title: "编辑",
    dataIndex: "edit",
    key: "edit",
    align: "center"
  }
])

// 选择功能的配置
const tileLayerRowSelection = ref({
  hideSelectAll: true,
  hideDefaultSelections: true,
  selectedRowKeys: rowKeys,
  onChange: (selectedRowKeys: string[]) => {
    rowKeys.value = selectedRowKeys
  },
  onSelect: (record: LayerTableItem, selected: boolean) => {
    const layer = map.getLayerById(record.key)
    layer.show = selected // 图层显示
  }
})
// 实现点击行聚焦到对应位置
const tileLayerCustomRowObj = (record) => {
  return {
    onClick: () => {
      const layer = map.getLayerById(record.key)
      if (layer) {
        layer.flyTo()
      }
    }
  }
}

let map
let thisLayer: any // 选中的图层

onMounted(() => {
  map = mapWork.map

  formState.hasAddTileLayer = Boolean(mapWork.addTileLayer)

  const list = []
  const layers = map.getLayers()
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]
    if (layer.isPrivate) {
      continue
    }

    list.push({
      key: layer.id,
      name: `${layer.type} - ${layer.name || "未命名"}`,
      isTile: layer.isTile
    })

    // 实现默认全部选中
    rowKeys.value.push(layer.id)
  }
  tileLayerList.value = list

  console.log("当前图层列表为", list)


  selectedFirst()

  // 添加新的图层，数组中也添加数据
  map.on(mars3d.EventType.addLayer, function (event) {
    const layer = event.layer
    if (layer.isPrivate || layer.name === "POI查询") {
      return
    }

    tileLayerList.value.push({
      key: layer.id,
      name: `${layer.type} - ${layer.name || "未命名"}`,
      isTile: layer.isTile
    })

    // 将新添加的图层也默认选中
    rowKeys.value.push(layer.id)

    // selectedFirst()
  })

  // 删除图层
  map.on(mars3d.EventType.removeLayer, function (event) {
    const layerId = event.layer.id

    const idx = tileLayerList.value.findIndex((item) => item.key === layerId)
    tileLayerList.value.splice(idx, 1)

    if (thisLayer && thisLayer.id === layerId) {
      thisLayer = null
      formState.layerName = "" // 隐藏编辑面板
    }
  })
})

function selectedFirst() {
  setTimeout(() => {
    // 选中第一个
    if (tileLayerList.value.length === 1) {
      startEditingLayer(tileLayerList.value[0])
    }
  }, 50)
}

// 编辑图层面板的参数
const options: GuiItem[] = [
  {
    type: "slider",
    field: "opacity",
    label: "透明度",
    step: 0.01,
    min: 0,
    max: 1,
    value: 1.0,
    extra: "{opacity}",
    extraWidth: 30,
    change(data) {
      setLayerOptions("opacity", data)
    }
  },
  {
    type: "slider",
    field: "brightness",
    label: "亮度",
    step: 0.01,
    min: 0,
    max: 3,
    value: 1.0,
    extra: "{brightness}",
    extraWidth: 30,
    change(data) {
      setLayerOptions("brightness", data)
    }
  },
  {
    type: "slider",
    field: "contrast",
    label: "对比度",
    step: 0.01,
    min: 0,
    max: 3,
    value: 1.16,
    extra: "{contrast}",
    extraWidth: 30,
    change(data) {
      setLayerOptions("contrast", data)
    }
  },
  {
    type: "slider",
    field: "hue",
    label: "色彩",
    step: 0.01,
    min: 0,
    max: 3,
    value: 0.1,
    extra: "{hue}",
    extraWidth: 30,
    change(data) {
      setLayerOptions("hue", data)
    }
  },
  {
    type: "slider",
    field: "saturation",
    label: "饱和度",
    step: 0.01,
    min: 0,
    max: 3,
    value: 1.0,
    extra: "{saturation}",
    extraWidth: 30,
    change(data) {
      setLayerOptions("saturation", data)
    }
  },
  {
    type: "slider",
    field: "gamma",
    label: "伽马值",
    step: 0.01,
    min: 0,
    max: 3,
    value: 0.53,
    extra: "{gamma}",
    extraWidth: 30,
    change(data) {
      setLayerOptions("gamma", data)
    }
  }
]

const setLayerOptions = (attribute: string, val: number) => {
  if (thisLayer) {
    thisLayer[attribute] = val
  }
}

const addTileLayer = () => {
  mapWork.addTileLayer()
}

const removeTileLayer = () => {
  mapWork.removeTileLayer()
}

// 表格行：删除图层
const deleteLayer = (record: LayerTableItem) => {
  const layer = map.getLayerById(record.key)
  if (layer) {
    layer.remove(true)
    formState.layerName = "" // 隐藏编辑面板
  }
}

// 点击显示编辑图层面板,将获取的面板数据放在新出现的面板上
const startEditingLayer = (record: LayerTableItem) => {
  if (!record.isTile) {
    return
  }

  formState.layerName = record.name // 获取到的对应图层的信息

  thisLayer = map.getLayerById(record.key)
  formState.show = thisLayer.show
}

// 调试显示隐藏
const onChangeShow = () => {
  if (thisLayer) {
    const idx = rowKeys.value.findIndex((item) => item === thisLayer.id)
    if (idx !== -1 && !formState.show) {
      rowKeys.value.splice(idx, 1)
    } else if (formState.show) {
      rowKeys.value.push(thisLayer.id)
    }

    thisLayer.show = formState.show
  }
}

const onChangePopup = () => {
  if (!thisLayer) {
    return
  }
  if (formState.hasPopup) {
    thisLayer.bindPopup("all")
  } else {
    thisLayer.unbindPopup()
  }
}

const onChangeHighlight = () => {
  if (!thisLayer) {
    return
  }
  if (formState.hasHighlight) {
    thisLayer.bindHighlight({
      clampToGround: true,
      fill: true,
      color: "#2deaf7",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9",
      outlineOpacity: 1.0
    })
  } else {
    thisLayer.unbindHighlight()
  }
}
</script>

<style scoped lang="less">
.tile-state {
  :deep(.mars-noHeader-table) {
    .ant-table {
      margin-top: 0;
    }
  }

}

.title {
  color: #EAF2FF;
  display: inline-block;
  font-size: 14px;
  width: 100%;
  height: 44px;
  background: #464C5A;
  line-height: 44px;
  padding-left: 10px;

  &::before {
    content: "|";
    background: #3385FF;
    color: #3385FF;
    border-radius: 4px;
    margin-right: 10px;
  }
}

.mars-pannel-item-label {
  // width: auto;
  width: 68px;
  min-width: auto;
}

.guiBox {
  margin-left: -3px;
}

.bottom-box {
  margin-left: -3px;
  padding-right: 14px;
  padding-left: 5px;
}

:deep(.ant-table-pagination) {
  margin: 10px 0 1px 0 !important;
}

.layer-control {
  margin-top: 10px;

  .mars-button {
    width: 146px;
  }
}

.property-content {
  width: 330px;
  margin-top: 26px;
  position: absolute;
  right: 0px;
  background: rgba(39, 44, 54, 0.8);
  border-radius: 4px !important;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  // border-image 与 border-radius 无法共存
  // border: 1px solid;
  // border-image:  var(--mars-base-border) 1;
}
</style>
