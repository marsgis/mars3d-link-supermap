<template>
  <div class="f-mb">
    <div>
      <a-space>
        <span class="mars-pannel-item-label">图层状态:</span>
        <a-checkbox v-model:checked="formState.enabledShowHide" @change="onChangeShow" title="显示隐藏状态">显示</a-checkbox>

        <mars-button v-if="!formState.enabledOpacity" @click="onClickFlyTo" title="视角定位" size="small">
          定位
        </mars-button>
      </a-space>
    </div>

    <div>
      <a-space>
        <span v-if="formState.enabledOpacity" class="mars-pannel-item-label" title="不是所有矢量数据均支持修改全局透明度">透明度:</span>
        <mars-slider v-if="formState.enabledOpacity" v-model:value="formState.opacity" :min="0.0" :max="1.0" :step="0.1"
          @change="onOpacityChange" />
        <mars-button v-if="formState.enabledOpacity" @click="onClickFlyTo" title="视角定位" size="small">
          定位
        </mars-button>
      </a-space>
    </div>

  </div>

  <div class="f-mb " v-if="props.interaction">
    <a-space>
      <span class="mars-pannel-item-label">图层交互:</span>
      <a-checkbox v-model:checked="formState.enabledPopup" @change="onChangePopup"
        title="是否绑定Popup鼠标单击弹窗">单击Popup</a-checkbox>
      <a-checkbox v-model:checked="formState.enabledTooltip" @change="onChangeTooltip"
        title="是否绑定Tooltip鼠标移入弹窗">移入Tooltip</a-checkbox>
    </a-space>
    <a-space>
      <a-checkbox class="rightMenu-checkbox" v-model:checked="formState.enabledRightMenu" @change="onChangeRightMenu"
        title="是否绑定右键菜单">右键菜单</a-checkbox>
      <a-checkbox class="rightMenu-checkbox1" v-if="formState.enabledCluster" v-model:checked="formState.isCluster"
        @change="onChangClustering" title="是否对点数据进行聚合">是否聚合</a-checkbox>
    </a-space>

  </div>

  <div class="f-mb" v-if="props.enabledDraw">
    <a-space>
      <span class="mars-pannel-item-label">数据维护:</span>
      <mars-button :class="props.drawLabel2 && !formState.isDrawing ? 'data-maintain-two' : 'data-maintain'"
        v-if="!formState.isDrawing" @click="onClickStartDraw">{{ props.drawLabel1
        }}</mars-button>
      <mars-button :class="props.drawLabel2 && !formState.isDrawing ? 'data-maintain-two' : 'data-maintain'"
        v-if="props.drawLabel2 && !formState.isDrawing" @click="onClickStartDraw2">{{
          props.drawLabel2
        }}</mars-button>
      <mars-button class="data-maintain" v-if="formState.isDrawing" @click="onClickClearDrawing">取消绘制</mars-button>
    </a-space>
  </div>

  <div class="data-edit">
    <a-checkbox v-if="props.interaction && formState.enabledEdit" v-model:checked="formState.isAutoEditing"
      @change="onChangeHasEdit" title="是否单击进行编辑状态">是否编辑</a-checkbox>
    <a-checkbox v-if="enabledTable" v-model:checked="formState.hasTable" title="显示图层内所有矢量数据列表">显示列表</a-checkbox>
  </div>

  <div class="f-mb f-pt" v-if="mapWork.addRandomGraphicByCount">
    <a-space>
      <span class="mars-pannel-item-label">数据测试:</span>
      <mars-input-number :min="1" :max="1000000" v-model:value="formState.count" step="1"></mars-input-number>条
      <mars-button @click="addRandomGraphicByCount">生成</mars-button>
      <mars-button @click="onClickClear" danger>
        清除
      </mars-button>
    </a-space>
  </div>

  <div class="f-mb">
    <a-space>
      <span class="mars-pannel-item-label">保存文件:</span>
      <!-- <mars-button @click="expGeoJSONFile" title="保存GeoJSON">
        导出GeoJSON
      </mars-button> -->

      <mars-button @click="expJSONFile" title="导出图层数据为JSON文件">导出数据</mars-button>
      <mars-button @click="impJSONFile" title="打开历史导出的JSON文件图层数据">导入数据</mars-button>
      <mars-button v-if="!mapWork.addRandomGraphicByCount" @click="onClickClear" danger>
        清除
      </mars-button>
    </a-space>
  </div>


  <div class="f-mb data-list">
    <mars-table class="mars-noHeader-table" size="small" v-if="enabledTable && formState.hasTable"
      :pagination="{ pageSize: currentPage, simple: true }" :customRow="graphicCustomRowObj"
      :row-selection="graphicRowSelection" :dataSource="graphicDataList" :columns="graphicColumns" :scroll="{ y: 400 }"
      @change="pageSizeChange" :showHeader="false" :bordered="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'caozuo'">
          <a-space>
            <mars-icon title="修改矢量数据样式" icon="editor" color="#f2f2f2" class="icon-vertical-a"
              @click.stop="startEditGraphic(record)" />
            <mars-icon title="删除矢量数据" icon="delete" color="#F96868" class="icon-vertical-a"
              @click.stop="deleteGraphic(record)" />
          </a-space>
        </template>
        <template v-else>
          {{ record.name }}
        </template>
      </template>
    </mars-table>
  </div>
</template>

<script lang="ts" setup>
/**
 * 公共组件：封装矢量图层操作
 * @copyright mars3d.cn
 * @author 木遥 2022-01-01
 */
import { ref, reactive, onMounted, markRaw } from "vue"
import type { UnwrapRef } from "vue"
import { $alert, $message, $showLoading, $hideLoading } from "@mars/components/mars-ui/index"
import { useWidget } from "@mars/widgets/common/store/widget"

const props = withDefaults(
  defineProps<{
    interaction?: boolean // 是否可以鼠标拾取和交互
    enabledDraw?: boolean // 是否可以绘制
    enabledTable?: boolean // 是否显示表格
    drawLabel1?: string // 绘制按钮 文本
    drawLabel2?: string // 绘制按钮2 文本
    defaultCount?: number // 默认的数据量
    customEditor?: string
    openEditor?: boolean // 是否自动打开属性面板
  }>(),
  {
    interaction: true,
    enabledDraw: true,
    enabledTable: true,
    drawLabel1: "图上标绘",
    drawLabel2: undefined,
    defaultCount: 100,
    customEditor: "",
    openEditor: false
  }
)

interface FormState {
  enabledShowHide: boolean
  enabledPopup: boolean
  enabledTooltip: boolean
  enabledRightMenu: boolean
  enabledCluster: boolean
  isCluster: boolean
  enabledOpacity: boolean
  opacity: number

  enabledEdit: boolean
  isAutoEditing: boolean

  hasTable: boolean
  count: number
  isDrawing: boolean
}

const formState: UnwrapRef<FormState> = reactive({
  enabledShowHide: true,
  enabledPopup: true,
  enabledTooltip: false,
  enabledRightMenu: false,
  enabledCluster: true,
  isCluster: false,
  enabledOpacity: true,
  opacity: 1,
  enabledEdit: true,
  isAutoEditing: false,
  hasTable: false,
  count: props.defaultCount,
  isDrawing: false
})

const currentPage = ref(5) // 分页查询每页条数

// mapWork是map.js内定义的所有对象， 在项目中使用时可以改为import方式使用:  import * as mapWork from './map.js'
const mapWork = window.mapWork
const mars3d = mapWork.mars3d

defineExpose({
  addTableData() {
    const graphicLayer = getManagerLayer()
    initGraphicableData(graphicLayer)
  }
})

onMounted(() => {
  // 恢复默认状态
  if (mapWork.eventTarget) {
    mapWork.eventTarget.on("defuatData", (item: any) => {
      formState.opacity = 1.0
      formState.enabledShowHide = item.enabledShowHide
      formState.enabledPopup = item.enabledPopup
      formState.enabledTooltip = item.enabledTooltip
      formState.enabledRightMenu = item.enabledRightMenu
    })
  }

  const layer = getManagerLayer()
  layer.on("initGraphicableData", function (e) {
    initGraphicableData(layer)
  })

  setTimeout(() => {
    const layer = getManagerLayer()
    if (layer) {
      formState.enabledShowHide = layer.show
      formState.enabledPopup = layer.hasPopup()
      formState.enabledTooltip = layer.hasTooltip()
      formState.enabledRightMenu = layer.hasContextMenu()
      formState.isAutoEditing = layer.isAutoEditing // 图层是否打开了编辑

      const graphics = layer.getGraphics()

      if (graphics.length > 0) {
        formState.hasTable = true

        const lastgraphic = graphics[graphics.length - 1]
        formState.enabledOpacity = lastgraphic.hasOpacity
        formState.enabledEdit = lastgraphic.hasEdit
        formState.enabledCluster = layer.collisionEnabled ? false : lastgraphic.hasCluster

        if (props.openEditor) {
          startEditGraphic({ key: lastgraphic.id, name: lastgraphic.name })// 自动打开编辑面板
        }
      }


      layer.on([mars3d.EventType.drawCreated, mars3d.EventType.addGraphic, mars3d.EventType.removeGraphic], function (e) {
        formState.isDrawing = layer.isDrawing
      })


    }
  }, 500)
})

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  if (mapWork.getManagerLayer) {
    return mapWork.getManagerLayer()
  }
  return mapWork.graphicLayer
}

// 分页查询每页条数
const pageSizeChange = (pagination) => {
  currentPage.value = pagination.pageSize
}

// 是否编辑
const onChangeHasEdit = () => {
  const layer = getManagerLayer()
  layer.isAutoEditing = formState.isAutoEditing

  // 编辑时，为了方便操作自动关闭Popup，真实项目中请按需修改
  formState.enabledPopup = !formState.isAutoEditing
  onChangePopup()
}

// 调整透明度
const onOpacityChange = () => {
  const layer = getManagerLayer()
  layer.opacity = formState.opacity
}

// 生成大数据
const addRandomGraphicByCount = () => {
  closeGraphicOptionsWidget() // 关闭属性面板

  $showLoading()
  const startTime = new Date().getTime()

  const result = mapWork.addRandomGraphicByCount(formState.count)

  if (!result) {
    return
  }
  $hideLoading()
  const endTime = new Date().getTime()
  const usedTime = (endTime - startTime) / 1000 // 两个时间戳相差的毫秒数
  $message(`生成${result || formState.count}条数据，共耗时${usedTime.toFixed(2)}秒`)

  const layer = getManagerLayer()
  initGraphicableData(layer)
  layer.flyTo({ duration: 0, heading: 0, pitch: -40, scale: 1.2 })
}

const onClickFlyTo = () => {
  const layer = getManagerLayer()
  layer.flyTo({ scale: 1.2 })
}

const onClickStartDraw = () => {
  closeGraphicOptionsWidget() // 关闭属性面板

  mapWork.startDrawGraphic()
  const layer = getManagerLayer()
  formState.isDrawing = layer?.isDrawing
}
const onClickStartDraw2 = () => {
  closeGraphicOptionsWidget() // 关闭属性面板

  mapWork.startDrawGraphic2()
  const layer = getManagerLayer()
  formState.isDrawing = layer?.isDrawing
}
const onClickClearDrawing = () => {
  const layer = getManagerLayer()
  layer.clearDrawing()
  formState.isDrawing = layer?.isDrawing
}

const onChangeShow = () => {
  const layer = getManagerLayer()
  layer.show = formState.enabledShowHide
}
const onChangePopup = () => {
  const layer = getManagerLayer()
  if (formState.enabledPopup) {
    if (mapWork.bindLayerPopup) {
      mapWork.bindLayerPopup()
    } else {
      bindLayerPopup()
    }
  } else {
    layer.unbindPopup()
  }
}

const onChangeTooltip = () => {
  const layer = getManagerLayer()
  if (formState.enabledTooltip) {
    // layer.bindTooltip("我是layer上绑定的Tooltip")
    layer.bindTooltip(
      function (event) {
        const attr = getAttrForEvent(event)
        attr["类型"] = event.graphic?.type
        attr["来源"] = "我是layer上绑定的Toolip"
        attr["备注"] = "我支持鼠标移入交互"

        return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
      },
      { pointerEvents: false }
    )
  } else {
    layer.unbindTooltip()
  }
}

const onChangeRightMenu = () => {
  const layer = getManagerLayer()
  if (formState.enabledRightMenu) {
    if (mapWork.bindLayerContextMenu) {
      mapWork.bindLayerContextMenu()
    } else {
      bindLayerContextMenu()
    }
  } else {
    layer.unbindContextMenu(true)
  }
}
const onChangClustering = () => {
  const layer = getManagerLayer()
  layer.clusterEnabled = formState.isCluster
}

// 在图层绑定Popup弹窗
function bindLayerPopup() {
  const graphicLayer = getManagerLayer()
  graphicLayer.bindPopup(
    function (event) {
      const attr = getAttrForEvent(event)
      attr["类型"] = event.graphic?.type
      attr["来源"] = "我是layer上绑定的Popup"
      attr["备注"] = "我支持鼠标交互"

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })

      // return new Promise((resolve) => {
      //   //这里可以进行后端接口请求数据，setTimeout测试异步
      //   setTimeout(() => {
      //     resolve('Promise异步回调显示的弹窗内容信息')
      //   }, 2000)
      // })
    },
    { pointerEvents: true }
  )
}

function getAttrForEvent(event) {
  if (event?.graphic?.attr) {
    return event.graphic.attr
  }
  if (!event.czmObject) {
    return {}
  }

  let attr = event.czmObject._attr || event.czmObject.properties || event.czmObject.attribute
  if (attr && attr.type && attr.attr) {
    attr = attr.attr // 兼容历史数据,V2内部标绘生产的geojson
  }
  return attr ?? {}
}

// 绑定右键菜单
function bindLayerContextMenu() {
  const graphicLayer = getManagerLayer()

  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "复制",
      icon: "fa fa-copy",
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          mapWork.map.contextmenu.copyGraphic = graphic.toJSON() // map内置右键中"粘贴"菜单使用
          mapWork.map.contextmenu.copyGraphic.layerId = graphicLayer.id
        }
      }
    },
    {
      text: "剪切",
      icon: "fa fa-scissors",
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          mapWork.map.contextmenu.copyGraphic = graphic.toJSON() // map内置右键中"粘贴"菜单使用
          mapWork.map.contextmenu.copyGraphic.layerId = graphicLayer.id

          graphic.remove(true) // 移除原有对象
        }
      }
    },
    {
      text: "还原编辑(还原到初始)",
      icon: "fa fa-pencil",
      show: (event) => {
        function hasRestore(graphic) {
          if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
            return false
          }
          return graphic.editing?.hasRestore()
        }

        const graphic = event.graphic
        if (hasRestore(graphic)) {
          return true
        }
        if (graphic.isPrivate && graphic.parent) {
          return hasRestore(graphic.parent) // 右击是编辑点时
        }
        return false
      },
      callback: (event) => {
        const graphic = event.graphic
        if (graphic.editing?.restore) {
          graphic.editing.restore() // 撤销编辑，可直接调用
        } else if (graphic.parent?.editing?.restore) {
          graphic.parent.editing.restore() // 右击是编辑点时
        }
      }
    },
    {
      text: "撤销编辑(还原到上一步)",
      icon: "fa fa-pencil",
      show: (event) => {
        function hasRevoke(graphic) {
          if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
            return false
          }
          return graphic.editing?.hasRevoke()
        }

        const graphic = event.graphic
        if (hasRevoke(graphic)) {
          return true
        }
        if (graphic.isPrivate && graphic.parent) {
          return hasRevoke(graphic.parent) // 右击是编辑点时
        }
        return false
      },
      callback: (event) => {
        const graphic = event.graphic
        if (graphic.editing?.revoke) {
          graphic.editing.revoke() // 撤销编辑，可直接调用
        } else if (graphic.parent?.editing?.revoke) {
          graphic.parent.editing.revoke() // 右击是编辑点时
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy || graphic.isPrivate || graphic.graphicIds) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "查看聚合列表",
      icon: "fa fa-info",
      show: (event) => {
        const graphic = event.graphic
        if (graphic.cluster && graphic.graphics) {
          return true
        } else {
          return false
        }
      },
      callback: (e) => {
        const graphics = e.graphic?.graphics
        if (graphics) {
          const names = []
          for (let index = 0; index < graphics.length; index++) {
            const g = graphics[index]
            names.push(g.attr.name || g.attr.text || g.id)
          }
          return $alert(`${names.join(",")}`, `共${graphics.length}个聚合对象`)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          ((graphic.type === "polygon" ||
            graphic.type === "polygonP" ||
            graphic.type === "wall" ||
            graphic.type === "scrollWall" ||
            graphic.type === "water") &&
            graphic.positionsShow?.length > 2)
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        $alert("该对象的面积为:" + strArea)
      }
    }
  ])
}

//  清除数据
const onClickClear = () => {
  const layer = getManagerLayer()

  layer.enabledEvent = false // 关闭事件，大数据removeGraphic时效率低
  layer.clear()
  if (mapWork.clear) {
    mapWork.clear()
  }
  layer.enabledEvent = true

  formState.isDrawing = false

  // 清除列表
  graphicDataList.value = []
  rowKeys.value = []
  closeGraphicOptionsWidget() // 关闭属性面板
}

// 保存json
const expJSONFile = () => {
  const graphicLayer = getManagerLayer()

  if (graphicLayer.length === 0) {
    $message("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toJSON()
  console.log("导出的数据为", geojson)
  mars3d.Util.downloadFile("矢量数据构造参数.json", JSON.stringify(geojson))
}
// 保存geojson
// const expGeoJSONFile = () => {
//   const graphicLayer = getManagerLayer()

//   if (graphicLayer.length === 0) {
//     $message("当前没有标注任何数据，无需保存！")
//     return
//   }
//   const geojson = graphicLayer.toGeoJSON()
//   mars3d.Util.downloadFile("矢量数据GeoJSON.json", JSON.stringify(geojson))
// }
// 打开json
const impJSONFile = async (info: any) => {
  const graphicLayer = getManagerLayer()

  const result = await mars3d.Util.openFile({ accept: ".json,.geojson,.kml" })
  console.log("打开了文件", result)
  const fileType = result.type

  if (fileType === "json" || fileType === "geojson") {
    graphicLayer.loadJSON(result.text, { flyTo: true, clear: true })
    initGraphicableData(graphicLayer)

  } else if (fileType === "kml") {
    mapWork.kgUtil.toGeoJSON(result.text).then((geojson) => {
      console.log("kml2geojson转换结果为", geojson)

      graphicLayer.loadGeoJSON(geojson, { flyTo: true })
    })
  } else if (fileType === "kmz") {
    // 加载input文件控件的二进制流
    mapWork.kgUtil.toGeoJSON(result.file).then((geojson) => {
      console.log("kmz2geojson", geojson)

      graphicLayer.loadGeoJSON(geojson, { flyTo: true })
    })
  } else {
    $message("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

const fileList = ref([])

// 数据编辑属性面板 相关处理
const { activate, disable, isActivate, updateWidget } = useWidget()
onMounted(() => {
  const graphicLayer = getManagerLayer()

  const editUpdateFun = mars3d.Util.funDebounce(openGraphicOptionsWidget, 500)
  graphicLayer.on(
    [
      mars3d.EventType.click,
      mars3d.EventType.drawCreated,
      mars3d.EventType.editStart,
      mars3d.EventType.editStyle
    ],
    editUpdateFun
  )

  const removeFun = mars3d.Util.funDebounce(closeGraphicOptionsWidget, 500)
  graphicLayer.on([
    mars3d.EventType.removeGraphic,
    mars3d.EventType.editStop // 退出编辑，属性面板隐藏
  ], removeFun)
})

function openGraphicOptionsWidget(event: any) {
  const graphic = event.graphic
  if (!graphic || graphic.isDestroy || graphic.isDrawing || graphic.isPrivate || graphic.isCombine || graphic.cluster) {
    return
  }

  if (props.customEditor === graphic.type) {
    closeGraphicOptionsWidget() // 关闭属性面板
    emit("onStartEditor", {
      graphicId: graphic.id,
      graphicName: getGraphicName(graphic)
    })
    return
  }
  emit("onStopEditor") // 关闭参数调节面板


  const graphicLayer = getManagerLayer()
  const data = { layerId: graphicLayer.id, graphicId: graphic.id }
  if (isActivate("graphic-options")) {
    updateWidget("graphic-options", data)
  } else {
    activate({ name: "graphic-options", data: data })
  }
}

function closeGraphicOptionsWidget() {
  if (props.customEditor) {
    emit("onStopEditor")
  } else {
    disable("graphic-options")
  }
}

// 数据列表
interface GraphicTableItem {
  key: number
  name: string
}
const graphicDataList = ref<GraphicTableItem[]>([])
const rowKeys = ref<number[]>([]) // 勾选的row

// 列表名称
const graphicColumns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "操作",
    dataIndex: "caozuo",
    key: "caozuo"

  }
]

const graphicRowSelection = {
  hideSelectAll: true,
  hideDefaultSelections: true,
  selectedRowKeys: rowKeys,
  onChange: (selectedRowKeys: number[]) => {
    rowKeys.value = selectedRowKeys // 使得点击之后选项改变
  },
  onSelect: (record: GraphicTableItem, selected: boolean) => {
    const graphicLayer = getManagerLayer()
    const graphic = graphicLayer.getGraphicById(record.key)
    if (graphic) {
      graphic.show = selected
    }
  }
}

onMounted(() => {
  const graphicLayer = getManagerLayer()
  initGraphicableData(graphicLayer)

  graphicLayer.on(mars3d.EventType.drawCreated, function (event) {
    const graphic = event.graphic
    if (graphic.isPrivate) {
      return
    }

    graphicDataList.value.push({
      key: graphic.id,
      name: getGraphicName(graphic)
    })
    rowKeys.value.push(graphic.id)
  })

  graphicLayer.on(mars3d.EventType.removeGraphic, function (event) {
    const graphicId = event.graphic.id
    const idx = graphicDataList.value.findIndex((item) => item.key === graphicId)
    if (idx !== -1) {
      graphicDataList.value.splice(idx, 1)
    }
  })
})

function initGraphicableData(graphicLayer) {
  graphicDataList.value = []
  rowKeys.value = []

  const list = graphicLayer.graphics
  let graphic
  for (let i = list.length - 1; i >= 0; i--) {
    graphic = list[i]
    graphicDataList.value.push({
      key: graphic.id,
      name: getGraphicName(graphic)
    })
    if (graphic.show) {
      rowKeys.value.push(graphic.id)
    }
  }

  if (list.length > 0) {
    formState.hasTable = true
  }
  if (graphic) {
    formState.enabledOpacity = graphic.hasOpacity
    formState.enabledEdit = graphic.hasEdit
    formState.enabledCluster = graphic.hasCluster
  }
}

function getGraphicName(graphic) {
  let name
  if (graphic.attr.name) {
    name = `${graphic.attr.name}`
  } else if (graphic.name) {
    name = `${graphic.type} - ${graphic.name}`
  } else if (graphic.attr.index) {
    name = `${graphic.type} - ${graphic.attr.index}`
  } else if (graphic.attr.remark) {
    name = `${graphic.type} - ${graphic.attr.remark}`
  } else if (graphic?.style?.label?.text && graphic.style.label.text !== "0") {
    name = `${graphic.type} - ${graphic.style.label.text}`
  } else {
    name = `${graphic.type} - ${graphic.name || "未命名"}`
  }

  graphic.attr.name = name // 记录备用
  return name
}

// 表格行: 点击含，飞行定位
const graphicCustomRowObj = (recode: any) => {
  return {
    onClick: () => {
      const graphicLayer = getManagerLayer()
      const graphic = graphicLayer.getGraphicById(recode.key)
      if (graphic) {
        graphic.flyTo()
      }
    }
  }
}

const emit = defineEmits(["onStartEditor", "onStopEditor"])

// 表格行: 开始编辑graphic
function startEditGraphic(record: GraphicTableItem) {
  const graphicLayer = getManagerLayer()
  const graphic = graphicLayer.getGraphicById(record.key)
  openGraphicOptionsWidget({ graphic }) // 修改style
}

// 表格行: 删除graphic
const deleteGraphic = (record: GraphicTableItem) => {
  const graphicLayer = getManagerLayer()
  const graphic = graphicLayer.getGraphicById(record.key)
  graphic && graphic.remove(true)
}
</script>

<style scoped lang="less">
.mars-pannel-item-label {
  width: auto;
}

.ant-input-number {
  width: 98px;
}

:deep(.ant-slider) {
  width: 160px;
}

// 数据维护按钮

.data-maintain {
  width: 228px !important;
}

.data-maintain-two {
  width: 112px;
}

.open-file-btn {
  margin-top: 10px;
  width: 232px !important;
  margin-left: 68px;
}

// 编辑
.data-edit,
.rightMenu-checkbox {
  margin-left: 68px;
}

.rightMenu-checkbox1 {
  margin-left: 15px;
}

.data-edit {
  display: flex;
  justify-content: space-between;

  :deep(.ant-checkbox+span) {
    padding-inline-end: 0 !important;
  }
}
</style>
