<template>
  <mars-dialog :visible="true" right="10" top="10" width="349">
    <mars-table
      size="small"
      :customRow="tyRowClick"
      :row-selection="rowSelection"
      bordered
      :pagination="{ pageSize: 5 }"
      :columns="columns"
      :data-source="typhoonList"
      rowKey="id"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
      </template>
    </mars-table>

    <div class="playBtn" v-if="formState.show">
      <a-space>
        <mars-button @click="startPlay" v-if="!formState.play">播放</mars-button>
        <mars-button @click="stopPlay" v-if="formState.play">停止</mars-button>

        已选择：{{ formState.name_cn }}
      </a-space>
    </div>

    <mars-table
      size="small"
      v-if="formState.show"
      :scroll="{ y: tableScrollHeight }"
      :sticky="true"
      bordered
      :pagination="false"
      :columns="columnsPath"
      :data-source="formState.path"
      :customRow="rowClick"
      rowKey="id"
    >
      <template #bodyCell="{ text }">
        <a>{{ text }}</a>
      </template>
    </mars-table>
  </mars-dialog>

  <div class="legendContent">
    <ul>
      <li><span class="round" style="background-color: #eed139"></span>热带低压</li>
      <li><span class="round" style="background-color: #0000ff"></span>热带风暴</li>
      <li><span class="round" style="background-color: #0f8000"></span>强热带风暴</li>
      <li><span class="round" style="background-color: #fe9c45"></span>台风</li>
      <li><span class="round" style="background-color: #fe00fe"></span>强台风</li>
      <li><span class="round" style="background-color: #fe0000"></span>超强台风</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { TableColumnType, TableProps } from "ant-design-vue"
import { setAutoHeight } from "@mars/utils/mars-util"
import axios from "axios"
import * as mapWork from "./map.js"

interface typhoon {
  id: number
  name_en: string
  name_cn: string
  typnumber?: string
  state?: string
  path?: any
  show: boolean // 是否显示
  play: boolean // 是否在播放
}
const columns: TableColumnType[] = [
  {
    title: "台风编号",
    dataIndex: "typnumber",
    key: "typnumber"
  },
  {
    title: "台风名(中文)",
    dataIndex: "name_cn"
  },
  {
    title: "台风名(英文)",
    dataIndex: "name_en"
  }
]

const columnsPath: TableColumnType[] = [
  {
    title: "时间",
    dataIndex: "time_str",
    width: 110,
    ellipsis: true
  },

  {
    title: "风速",
    dataIndex: "centerSpeed",
    width: 46
  },
  {
    title: "移向",
    dataIndex: "moveTo_str"
  },
  {
    title: "强度",
    dataIndex: "level_str"
  }
]

const typhoonList = ref<typhoon[]>([]) // 台风列表数据
const tableScrollHeight = ref(100)
// 当前选择的台风
const formState = reactive<typhoon>({
  id: 0,
  name_en: "",
  name_cn: "",
  path: [],
  show: false,
  play: false
})

// 高度自适应
onMounted(() => {
  // 访问后端接口，取台风列表数据
  // url: "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_default", //在线实时接口
  const url = "//data.mars3d.cn/file/apidemo/typhoon/list_2020.json"
  axios.get(url).then(function (res: any) {
    const data = res.data
    typhoonList.value = data.typhoonList.map((item: any) => ({
      id: item[0],
      name_en: item[1],
      name_cn: item[2],
      typnumber: item[3],
      state: item[7]
    }))
  })

  setAutoHeight((height) => {
    tableScrollHeight.value = height - 64
  }, 420)
})

const rowSelection: TableProps["rowSelection"] = {
  hideSelectAll: true,
  onSelect: (selectedRowKeys: typhoon, selected: boolean) => {
    selectedRowKeys.show = selected

    if (selected) {
      if (!selectedRowKeys.path) {
        getPath(selectedRowKeys.id).then(function (res: any) {
          selectedRowKeys.path = res.path
          selectOneTyphoon(selectedRowKeys)
        })
      } else {
        selectOneTyphoon(selectedRowKeys)
      }
    } else {
      formState.show = false
      formState.play = false
      formState.path = []
      formState.name_cn = ""
      mapWork.unSelectOneTyphoon(selectedRowKeys.id)
    }
  }
}
// 点击台风列表的行
const tyRowClick = (recode: typhoon) => {
  return {
    onClick: () => {
      if (recode.show && recode.path) {
        selectOneTyphoon(recode)
      }
    }
  }
}

// 选择了单个台风
function selectOneTyphoon(item: typhoon) {
  formState.path = item.path
  formState.name_cn = item.name_cn
  formState.show = true
  formState.play = false

  mapWork.selectOneTyphoon(item)
}

// 访问后端接口，取单个台风轨迹数据
function getPath(id) {
  // url: "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_" + id, //在线实时接口
  const url = "http://data.mars3d.cn/file/apidemo/typhoon/view_" + id + ".json"
  return axios.get(url).then(function (res: any) {
    const newData = conversionPathData(res.data.typhoon) // 在Typhoon.js中
    return newData
  })
}

// 点击行
const rowClick = (recode: any) => {
  return {
    onClick: () => {
      mapWork.clickPathRow(recode)
    }
  }
}

const startPlay = () => {
  mapWork.startPlay()
  formState.play = true
}

const stopPlay = () => {
  mapWork.stopPlay()
  formState.play = false
}

// 转换数据,将后端接口数据转换为需要的格式
function conversionPathData(oldData) {
  const path = []
  oldData[8].forEach((message) => {
    let circle7
    let circle10
    let circle12
    message[10].forEach((level) => {
      const radiusObj = {
        speed: level[0],
        radius1: level[1],
        radius2: level[2],
        radius3: level[3],
        radius4: level[4]
      }

      if (level[0] === "30KTS") {
        circle7 = radiusObj
      } else if (level[0] === "50KTS") {
        circle10 = radiusObj
      } else if (level[0] === "64KTS") {
        circle12 = radiusObj
      } else {
        console.log("未处理风圈", radiusObj)
      }
    })

    // 预测路径
    const babj = message[11]?.BABJ
    let arrForecast
    if (babj) {
      arrForecast = []
      babj.forEach((element) => {
        const newArr = {
          time: element[0], // 几小时预报
          time_str: element[1],
          lon: element[2], // 预报经度
          lat: element[3], // 预报纬度
          strength: element[4], // 中心气压
          centerSpeed: element[5], // 最大风速  m/s
          level: element[7], // 预报台风等级, 代码
          color: getColor(element[7]) // 对应等级的颜色
        }
        arrForecast.push(newArr)
      })
    }

    const time = mapWork.formatDate(new Date(message[2]), "yy-MM-dd HH:mm") // 时间

    path.push({
      id: message[0], // 唯一标识
      time: new Date(message[2]), // 时间
      time_str: time, // 时间格式化字符串
      level: message[3], // 台风等级, 代码
      level_str: getLevelStr(message[3]),
      color: getColor(message[3]), // 对应等级的颜色
      lon: message[4], // 经度
      lat: message[5], // 纬度
      strength: message[6], // 中心气压,百帕
      centerSpeed: message[7], // 最大风速,米/秒
      moveTo: message[8], // 移动方向, 代码
      moveTo_str: getMoveToStr(message[8]),
      windSpeed: message[9], // 移动速度,公里/小时

      circle7: circle7, // 7级风圈, 对象
      circle10: circle10, // 10级风圈, 对象
      circle12: circle12, // 12级风圈, 对象
      forecast: arrForecast // 预测路径, 数组
    })
  })

  return {
    // id: oldData[0],
    // name_en: oldData[1], // 台风名字,英文
    // name_cn: oldData[2], // 台风名字
    // typnumber: oldData[3], // 台风编号
    // state: oldData[7],
    path: path
  }
}

// 不同等级的台风对应不同的颜色
function getColor(level) {
  switch (level) {
    case "TD": // 热带低压
      return "rgb(238,209,57)"
    case "TS": // 热带风暴
      return "rgb(0,0,255)"
    case "STS": // 强热带风暴
      return "rgb(15,128,0)"
    case "TY": // 台风
      return "rgb(254,156,69)"
    case "STY": // 强台风
      return "rgb(254,0,254)"
    case "SuperTY": // 超强台风
      return "rgb(254,0,0)"
    default:
  }
}

function getLevelStr(value) {
  switch (value) {
    case "TD":
      return "热带低压"
    case "TS":
      return "热带风暴"
    case "STS":
      return "强热带风暴"
    case "TY":
      return "台风"
    case "STY":
      return "强台风"
    case "SuperTY":
      return "超强台风"
    default:
  }
}

function getMoveToStr(value) {
  switch (value) {
    case "N":
      return "北"
    case "NNE":
      return "北东北"
    case "NE":
      return "东北"
    case "ENE":
      return "东东北"
    case "E":
      return "东"
    case "ESE":
      return "东东南"
    case "ES":
      return "东南"
    case "SSE":
      return "南东南"
    case "S":
      return "南"
    case "SSW":
      return "南西南"
    case "SW":
      return "西南"
    case "WSW":
      return "西西南"
    case "W":
      return "西"
    case "WNW":
      return "西北西"
    case "NW":
      return "北西"
    case "NNW":
      return "北西北"
    default:
  }
}
</script>
<style scoped lang="less">
.playBtn {
  margin-bottom: 5px;
}

.legendContent {
  position: fixed;
  bottom: 35px;
  left: 48px;
  color: #e9e9e9;
  text-shadow: 2px 2px 2px #000;
  background-color: rgba(0, 0, 0, 0.4);
}
.legendContent ul {
  margin: 0;
  padding: 0;
}
.legendContent li {
  margin: 3px 9px;
  line-height: 22px;
  float: left;
}
.legendContent span.round {
  width: 8px;
  height: 8px;
  border-radius: 5px;
  display: inline-block;
  margin-right: 6px;
}
</style>
