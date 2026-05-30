<template>
  <div :class="props.label !== '' ? '' : 'tools'">
    <span class="state-label" v-if="props.label !== ''">{{ props.label }}</span>
    <a-checkbox v-model:checked="formState.enabledShowHide" @change="onChangeShow" title="显示隐藏状态">显示</a-checkbox>
    <a-checkbox v-model:checked="formState.enabledPopup" @change="onChangePopup"
      title="是否绑定Popup鼠标单击弹窗">Popup</a-checkbox>
    <a-checkbox v-model:checked="formState.enabledTooltip" @change="onChangeTooltip"
      title="是否绑定Tooltip鼠标移入弹窗">Tooltip</a-checkbox>

    <a-checkbox :class="props.label !== '' ? 'last-checkbox' : ''" v-model:checked="formState.enabledRightMenu"
      @change="onChangeRightMenu" title="是否绑定右键菜单">右键菜单</a-checkbox>
  </div>
</template>

<script lang="ts" setup>
/**
 * 公共组件：封装图层状态操作
 * @copyright mars3d.cn
 * @author 木遥 2022-01-01
 */
import { ref, reactive, onMounted, markRaw } from "vue"
import type { UnwrapRef } from "vue"
import { $alert } from "@mars/components/mars-ui/index"
import { useWidget } from "@mars/widgets/common/store/widget"

const props = withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: "图层状态:"
  }
)

interface FormState {
  enabledShowHide: boolean
  enabledPopup: boolean
  enabledTooltip: boolean
  enabledRightMenu: boolean
}

// mapWork是map.js内定义的所有对象， 在项目中使用时可以改为import方式使用:  import * as mapWork from './map.js'
const mapWork = window.mapWork
const mars3d = mapWork.mars3d
const Cesium = mapWork.Cesium

const formState: UnwrapRef<FormState> = reactive({
  enabledShowHide: true,
  enabledPopup: true,
  enabledTooltip: false,
  enabledRightMenu: false
})

// 恢复默认状态

if (mapWork.eventTarget) {
  mapWork.eventTarget.on("defuatData", (item: any) => {
    formState.enabledShowHide = item.enabledShowHide
    formState.enabledPopup = item.enabledPopup
    formState.enabledTooltip = item.enabledTooltip
    formState.enabledRightMenu = item.enabledRightMenu
  })
}

setTimeout(() => {
  const layer = getManagerLayer()
  if (layer) {
    formState.enabledShowHide = layer.show
    formState.enabledPopup = layer.hasPopup()
    formState.enabledTooltip = layer.hasTooltip()
    formState.enabledRightMenu = layer.hasContextMenu()
  }
}, 1000)

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  if (mapWork.getManagerLayer) {
    return mapWork.getManagerLayer()
  }
  return mapWork.graphicLayer
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
      { pointerEvents: true }
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
    // {
    //   text: "开始编辑对象",
    //   icon: "fa fa-edit",
    //   show: function (e) {
    //     const graphic = e.graphic
    //     if (!graphic || !graphic.hasEdit) {
    //       return false
    //     }
    //     return !graphic.isEditing
    //   },
    //   callback: (e) => {
    //     const graphic = e.graphic
    //     if (!graphic) {
    //       return false
    //     }
    //     if (graphic) {
    //       graphicLayer.startEditing(graphic)
    //     }
    //   }
    // },
    // {
    //   text: "停止编辑对象",
    //   icon: "fa fa-edit",
    //   show: function (e) {
    //     const graphic = e.graphic
    //     if (!graphic || !graphic.hasEdit) {
    //       return false
    //     }
    //     return graphic.isEditing
    //   },
    //   callback: (e) => {
    //     const graphic = e.graphic
    //     if (!graphic) {
    //       return false
    //     }
    //     if (graphic) {
    //       graphic.stopEditing()
    //     }
    //   }
    // },
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
        if (!graphic) {
          return false
        }
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
        if (!graphic) {
          return false
        }
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
        if (!graphic || graphic.isDestroy || graphic.graphicIds) {
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
        if (graphic && graphic.cluster && graphic.graphics) {
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

// 数据编辑属性面板 相关处理
const { activate, disable, isActivate, updateWidget } = useWidget()
onMounted(async () => {
  const mars3d = window.mapWork.mars3d
  const graphicLayer = await getManagerLayer()
  // 矢量数据创建完成
  if (graphicLayer) {

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
    graphicLayer.on(mars3d.EventType.removeGraphic, removeFun)
  }
})

function openGraphicOptionsWidget(event: any) {
  const graphic = event.graphic
  if (!graphic || graphic.isDestroy || graphic.isDrawing || graphic.isPrivate || graphic.isCombine) {
    return
  }

  const graphicLayer = getManagerLayer()
  const data = { layerId: graphicLayer.id, graphicId: graphic.id }
  if (isActivate("graphic-options")) {
    updateWidget("graphic-options", data)
  } else {
    activate({ name: "graphic-options", data: data })
  }
}

function closeGraphicOptionsWidget() {
  disable("graphic-options")
}

</script>
<style scoped lang="less">
.mars-pannel-item-label {
  width: auto;
}

.tools {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}


.state-label {
  color: rgba(234, 242, 255, 0.8);
  padding-right: 10px;
}

.last-checkbox {
  margin-left: 70px;
  margin-top: 10px;
}
</style>
