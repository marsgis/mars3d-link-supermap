<template>
  <mars-dialog :visible="true" right="10" top="10">
    <div class="edit-contain">
      <mars-gui :options="options" ref="marsGuiRef"></mars-gui>
      <div class="f-tac load-button">
        <a-space>
          <mars-button size="middle" @click="loadCoverage">{{ loadCoverageText }}</mars-button>
          <mars-button size="middle" @click="reset">重置参数</mars-button>
          <mars-button size="middle" @click="saveParams">保存参数</mars-button>
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, h } from "vue"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"
import MarsButton from "@mars/components/mars-ui/mars-button/index.vue"
import { stringify } from "querystring"

const marsGuiRef = ref()
const options: GuiItem[] = [
  {
    type: "input",
    field: "url",
    label: "图层URL",
    value: "//data.mars3d.cn/tile/dizhiChina/{z}/{x}/{y}.png",
    change(data) {
      onCheckedoutUrl(data)
      dataUpdate()
    }
  },
  {
    type: "select",
    field: "type",
    label: "类型",
    value: "xyz",
    data: [
      {
        value: "xyz",
        label: "标准金字塔地图"
      },
      {
        value: "wms",
        label: "WMS标准服务"
      },
      {
        value: "wmts",
        label: "WMTS标准服务"
      },
      {
        value: "arcgis",
        label: "ArcGIS标准服务"
      },
      {
        value: "arcgis_cache",
        label: "ArcGIS切片"
      },
      {
        value: "image",
        label: "单张图片"
      }
    ],
    change(data) {
      marsGuiRef.value.updateField("type", data)
      dataUpdate()
    }
  },
  {
    type: "input",
    field: "txtLayer",
    label: "图层名",
    value: "",
    change(data) {
      marsGuiRef.value.updateField("txtLayer", data)
      dataUpdate()
    },
    show(data) {
      return data.type === "wms" || data.type === "wmts"
    }
  },
  {
    type: "select",
    field: "txtTileFormat",
    label: "瓦片格式",
    value: "png",
    change(data) {
      marsGuiRef.value.updateField("txtLayer", data)
      dataUpdate()
    },
    show(data) {
      return data.type === "wms" || data.type === "wmts"
    },
    data: [
      {
        value: "image/png",
        label: "png"
      },
      {
        value: "image/jpeg",
        label: "jpeg"
      }
    ]
  },
  {
    type: "select",
    field: "CRS",
    label: "坐标系",
    value: "",
    change(data) {
      marsGuiRef.value.updateField("CRS", data)
      dataUpdate()
    },
    data: [
      {
        value: "",
        label: "默认"
      },
      {
        value: "EPSG:3857",
        label: "EPSG:3857"
      },
      {
        value: "EPSG:4326",
        label: "EPSG:4326"
      },
      {
        value: "EPSG:4490",
        label: "EPSG:4490"
      }
    ]
  },
  {
    type: "select",
    field: "chinaCRS",
    label: "国内坐标系",
    value: "WGS84",
    change(data) {
      marsGuiRef.value.updateField("chinaCRS", data)
      dataUpdate()
    },
    data: [
      {
        value: "WGS84",
        label: "标准无偏"
      },
      {
        value: "GCJ02",
        label: "国测局偏移"
      },
      {
        value: "BAIDU",
        label: "百度偏移"
      }
    ]
  },
  {
    type: "slider",
    field: "loadLevel",
    label: "加载层级",
    step: 1,
    range: true,
    min: 0,
    max: 21,
    value: [0, 21],
    change(data) {
      marsGuiRef.value.updateField("loadLevel", data)
      dataUpdate()
    }
  },
  {
    type: "slider",
    field: "showLevel",
    label: "显示层级",
    step: 1,
    range: true,
    min: 0,
    max: 21,
    value: [0, 21],
    change(data) {
      marsGuiRef.value.updateField("showLevel", data)
      dataUpdate()
    }
  },
  {
    type: "input",
    field: "rectangle",
    label: "矩形范围",
    value: "",
    extra: h(
      MarsButton,
      {
        onClick: () => {
          btnDrawExtent()
        }
      },
      "绘制"
    ),
    extraType: "custom",
    change(data) {
      if (data === "") {
        mapWork.btnClearExtent()
      }
      marsGuiRef.value.updateField("rectangle", data)
      dataUpdate()
    }
  },
  {
    type: "slider",
    field: "opacity",
    label: "透明度",
    step: 0.01,
    min: 0,
    max: 1,
    value: 1,
    change(data) {
      marsGuiRef.value.updateField("opacity", data)
      mapWork.changeOpacity(data)
      dataUpdate()
    }
  },
  {
    type: "slider",
    field: "brightness",
    label: "亮度",
    step: 0.01,
    min: 0,
    max: 1,
    value: 1,
    change(data) {
      marsGuiRef.value.updateField("brightness", data)
      mapWork.changeBrightness(data)
      dataUpdate()
    }
  },
  {
    type: "checkbox",
    field: "agent",
    label: "代理",
    data: [
      {
        label: "使用代理",
        value: true
      }
    ],
    change(data) {
      if (data[0]) {
        marsGuiRef.value.updateField("chkProxy", true)
      } else {
        marsGuiRef.value.updateField("chkProxy", false)
      }
      dataUpdate()
    }
  }
]

let updateValue

const onCheckedoutUrl = (data) => {
  const url = data.toLowerCase()
  if (url.indexOf("wms") !== -1) {
    marsGuiRef.value.updateField("type", "wms")
  } else if (url.indexOf("wmts") !== -1) {
    marsGuiRef.value.updateField("type", "wmts")
  } else if (url.indexOf("_alllayers") !== -1) {
    marsGuiRef.value.updateField("type", "arcgis_cache")
  } else if (url.indexOf("arcgis") !== -1) {
    marsGuiRef.value.updateField("type", "arcgis")
  } else if (url.indexOf("{x}") !== -1 && url.indexOf("{z}") !== -1) {
    marsGuiRef.value.updateField("type", "xyz")
  }
}
const loadCoverageText = ref("加载图层")
const loadCoverageShow = ref(false)
const loadCoverage = async () => {
  // 加载图层

  if (!loadCoverageShow.value) {
    mapWork.createTileLayer(updateValue)
  } else {
    mapWork.removeLayer()
  }
  loadCoverageText.value = loadCoverageShow.value ? "加载图层" : "移除图层"
  loadCoverageShow.value = !loadCoverageShow.value
}

const reset = () => {
  marsGuiRef.value.updateField("rectangle", "")

  // 清除绘制区域和移除加载的矢量数据
  mapWork.btnClearExtent()
  mapWork.removeLayer()
}

const saveParams = () => {
  mapWork.saveParams(updateValue)
}

onMounted(() => {
  const lastData = JSON.parse(localStorage.getItem("tileLayer_edit"))
  if (lastData) {
    marsGuiRef.value.updateFields(lastData)
    updateAllData(lastData)
    if (lastData.rectangle) {
      mapWork.creatHRectangleEntity(JSON.parse(lastData.rectangle))
    }
    console.log("lastData", lastData)
  } else {
    dataUpdate()
  }
})

mapWork.eventTarget.on("rectangle", (e: any) => {
  if (e.rectangle) {
    marsGuiRef.value.updateField("rectangle", JSON.stringify(e.rectangle))
    dataUpdate()
  }
})

// 当参数改变时，修改加载图层的部分参数
const dataUpdate = () => {
  const data = marsGuiRef.value.getValues()
  updateAllData(data)
  mapWork.dataUpdate(updateValue)
  // 记录到历史
  localStorage.setItem("tileLayer_edit", JSON.stringify(data))
}

const updateAllData = (data) => {
  updateValue = reactive({
    url: data.url,
    type: data.type,
    txtLayer: data.txtLayer,
    txtTileFormat: data.txtTileFormat,
    CRS: data.CRS,
    chinaCRS: data.chinaCRS,
    minLoadLevel: data.loadLevel[0],
    maxLoadLevel: data.loadLevel[1],
    minShowLevel: data.showLevel[0],
    maxShowLevel: data.showLevel[1],
    rectangle: data.rectangle ? JSON.parse(data.rectangle) : null,
    opacity: data.opacity,
    brightness: data.brightness,
    chkProxy: data.chkProxy
  })
}

// 绘制和清除区域
const btnDrawExtent = () => {
  mapWork.btnDrawExtent(updateValue)
}
</script>

<style scoped lang="less">
.edit-contain {
  width: 340px;
}

.load-button {
  margin-top: 10px;
}
</style>
