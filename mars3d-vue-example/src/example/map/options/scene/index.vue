<template>
  <mars-dialog :visible="true" right="10" top="10" bottom="40" width="360">
    <mars-table :columns="columns" :data-source="data" bordered :pagination="false" :scroll="{ y: 800 }">
      <template #bodyCell="{ column, text, index }">
        <template v-if="column.dataIndex === 'name'">
          <a href="https://mars3d.cn/api/Map.html#.sceneOptions" target="_black">{{ text }}</a>
        </template>

        <!-- select下拉选择 -->
        <template v-if="column.dataIndex === 'operation'">
          <mars-select
            v-if="data[index].operation === 'select'"
            v-model:value="scene"
            ref="select"
            style="width: 110px"
            @change="handleChange"
            :options="selectOptions"
          >
          </mars-select>
          <!-- radio -->
          <a-radio-group
            @change="(data[index] as any).change(index)"
            v-if="data[index].operation === 'checked'"
            v-model:value="data[index].value"
            :name="'radioGroup' + index"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
          <!-- 颜色选择器 -->
          <mars-color-picker
            v-if="data[index].operation === 'color'"
            @change="(data[index] as any).change(index)"
            v-model:value="data[index].value"
          />

          <!-- range滑动 -->
          <mars-slider
            @change="(data[index] as any).change(index)"
            v-if="data[index].operation === 'range'"
            v-model:value="data[index].value"
            :min="data[index].min"
            :max="data[index].max"
            :step="data[index].step"
          />
        </template>
      </template>
    </mars-table>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import type { TableColumnType } from "ant-design-vue"
import { setAutoHeight } from "@mars/utils/mars-util"
import * as mapWork from "./map.js"

const data = ref([
  {
    key: "1",
    name: "场景Scene",
    describe: "场景模式",
    operation: "select",
    value: 3
  },
  {
    key: "2",
    name: "场景Scene",
    describe: "高动态渲染",
    operation: "checked",
    value: "2",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("highDynamicRange", true)
      } else {
        mapWork.setSceneOptions("highDynamicRange", false)
      }
    }
  },
  {
    key: "3",
    name: "场景Scene",
    describe: "快速抗锯齿",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("fxaa", true)
      } else {
        mapWork.setSceneOptions("fxaa", false)
      }
    }
  },
  {
    key: "4",
    name: "场景Scene",
    describe: "显示太阳",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("showSun", true)
      } else {
        mapWork.setSceneOptions("showSun", false)
      }
    }
  },
  {
    key: "5",
    name: "场景Scene",
    describe: "显示月亮",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("showMoon", true)
      } else {
        mapWork.setSceneOptions("showMoon", false)
      }
    }
  },
  {
    key: "6",
    name: "场景Scene",
    describe: "显示天空盒子",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("showSkyBox", true)
      } else {
        mapWork.setSceneOptions("showSkyBox", false)
      }
    }
  },
  {
    key: "7",
    name: "场景Scene",
    describe: "空间背景色",
    operation: "color",
    value: "#000000",
    change(index: number) {
      mapWork.setSceneOptions("backgroundColor", data.value[index].value)
    }
  },
  {
    key: "8",
    name: "场景Scene",
    describe: "大气外光圈",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("showSkyAtmosphere", true)
      } else {
        mapWork.setSceneOptions("showSkyAtmosphere", false)
      }
    }
  },
  {
    key: "9",
    name: "场景Scene",
    describe: "雾化效果",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneOptions("fog", true)
      } else {
        mapWork.setSceneOptions("fog", false)
      }
    }
  },
  {
    key: "10",
    name: "地球Globe",
    describe: "地形夸张倍数",
    operation: "range",
    value: 1,
    min: 1,
    max: 80,
    step: 1,
    change(index: number) {
      mapWork.setSceneGlobeOptions("terrainExaggeration", data.value[index].value)
    }
  },
  {
    key: "11",
    name: "地球Globe",
    describe: "昼夜区域",
    operation: "checked",
    value: "2",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneGlobeOptions("enableLighting", true)
      } else {
        mapWork.setSceneGlobeOptions("enableLighting", false)
      }
    }
  },
  {
    key: "12",
    name: "地球Globe",
    describe: "绘制地面大气",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneGlobeOptions("showGroundAtmosphere", true)
      } else {
        mapWork.setSceneGlobeOptions("showGroundAtmosphere", false)
      }
    }
  },
  {
    key: "13",
    name: "地球Globe",
    describe: "深度监测",
    operation: "checked",
    value: "2",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneGlobeOptions("depthTestAgainstTerrain", true)
      } else {
        mapWork.setSceneGlobeOptions("depthTestAgainstTerrain", false)
      }
    }
  },
  {
    key: "14",
    name: "地球Globe",
    describe: "显示底图",
    operation: "checked",
    value: "1",
    change(index: number) {
      mapWork.showBaseMap(data.value[index].value)
    }
  },
  {
    key: "15",
    name: "地球Globe",
    describe: "地球背景色",
    operation: "color",
    value: "#000000",
    change(index: number) {
      mapWork.setSceneGlobeOptions("baseColor", data.value[index].value)
    }
  },
  {
    key: "16",
    name: "鼠标交互",
    describe: "缩放地图",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneCameraControllerOptions("enableZoom", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableZoom", false)
      }
    }
  },
  {
    key: "17",
    name: "鼠标交互",
    describe: "倾斜相机",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneCameraControllerOptions("enableTilt", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableTilt", false)
      }
    }
  },
  {
    key: "18",
    name: "鼠标交互",
    describe: "旋转转换位置",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneCameraControllerOptions("enableRotate", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableRotate", false)
      }
    }
  },
  {
    key: "19",
    name: "鼠标交互",
    describe: "平移地图",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneCameraControllerOptions("enableTranslate", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableTranslate", false)
      }
    }
  },
  {
    key: "20",
    name: "鼠标交互",
    describe: "南北极绕轴心旋转",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneCameraControllerOptions("constrainedAxis", true)
      } else {
        mapWork.setSceneCameraControllerOptions("constrainedAxis", false)
      }
    }
  },
  {
    key: "21",
    name: "鼠标交互",
    describe: "是否进入地下",
    operation: "checked",
    value: "1",
    change(index: number) {
      if (Number(data.value[index].value) === 1) {
        mapWork.setSceneCameraControllerOptions("enableCollisionDetection", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableCollisionDetection", false)
      }
    }
  },
  {
    key: "22",
    name: "鼠标交互",
    describe: "最小碰撞高度",
    operation: "range",
    value: 15000,
    min: 100,
    max: 500000,
    step: 100,
    change(index: number) {
      mapWork.setSceneCameraControllerOptions("minimumCollisionTerrainHeight", data.value[index].value)
    }
  },
  {
    key: "23",
    name: "鼠标交互",
    describe: "相机最近视距",
    operation: "range",
    value: 1,
    min: 1,
    max: 10000,
    step: 1,
    change(index: number) {
      mapWork.setSceneCameraControllerOptions("minimumZoomDistance", data.value[index].value)
    }
  },
  {
    key: "24",
    name: "鼠标交互",
    describe: "相机最远视距",
    operation: "range",
    value: 50000000,
    min: 10000,
    max: 90000000,
    step: 1000,
    change(index: number) {
      mapWork.setSceneCameraControllerOptions("maximumZoomDistance", data.value[index].value)
    }
  },
  {
    key: "25",
    name: "鼠标交互",
    describe: "滚轮放大倍数",
    operation: "range",
    value: 3,
    min: 1,
    max: 10,
    step: 1,
    change(index: number) {
      mapWork.setSceneCameraControllerOptions("zoomFactor", data.value[index].value)
    }
  }
])

const columns: TableColumnType[] = [
  {
    title: "类型",
    dataIndex: "name",
    width: 80,
    customRender: ({ index }: any) => {
      const obj = {
        props: {} as any
      }
      if (index === 0) {
        obj.props.rowSpan = 9
      } else {
        obj.props.rowSpan = 0
      }

      if (index === 9) {
        obj.props.rowSpan = 7
      }
      if (index === 16) {
        obj.props.rowSpan = 12
      }
      return obj
    }
  },
  {
    title: "场景描述",
    dataIndex: "describe"
  },
  {
    title: "操作",
    dataIndex: "operation"
  }
]
const selectOptions = ref([
  {
    value: 3, // Cesium.SceneMode.SCENE3D
    label: "三维视图"
  },
  {
    value: 2, // Cesium.SceneMode.SCENE2D
    label: "二维视图"
  },
  {
    value: 1, // Cesium.SceneMode.COLUMBUS_VIEW
    label: "哥伦布视图"
  }
])

const scene = ref<string>("三维视图")

const handleChange = (value: string) => {
  mapWork.sceneMode(value)
}
</script>
<style scoped lang="less">
:deep(.ant-table-tbody > tr > td) {
  padding: 4px;
}
//调整head行属性
:deep(.ant-table-tbody > tr > th) {
  padding: 4px;
}
</style>
