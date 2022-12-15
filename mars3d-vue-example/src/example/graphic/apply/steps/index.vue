<template>
  <mars-dialog :visible="true" right="10" top="10">
    <a-space>
      <mars-button v-if="!isPlay || isPause" @click="play">
        <a-space>
          <mars-icon icon="handle-triangle" class="icon-vertical-a" />
          <span>{{ isPause ? "继续" : "开始" }}</span>
        </a-space>
      </mars-button>
      <mars-button v-if="isPlay && !isPause" @click="pause">
        <a-space>
          <mars-icon icon="pause-one" class="icon-vertical-a" />
          <span>暂停</span>
        </a-space>
      </mars-button>
      <mars-button v-if="isPlay" @click="stop">
        <a-space>
          <mars-icon icon="power" class="icon-vertical-a" />
          <span>停止</span>
        </a-space>
      </mars-button>
    </a-space>
    <mars-tree class="f-mb" :tree-data="treeData" v-model:selectedKeys="selectedKeys" :defaultExpandAll="true" :selectable="true">
      <template #title="{ title, isLeaf, dataRef }">
        <span @click="startBegin(dataRef)" v-if="isLeaf" type="link">{{ title }}({{ dataRef.times }}秒)</span>
        <span v-else>{{ title }}</span>
      </template>
    </mars-tree>
    <template v-if="isPlay">
      <h3 class="f-mb show-time">总时长：{{ totalTimes }}</h3>
      <h3 class="f-mb show-time">当前: {{ currentWork }}&nbsp;{{ counter }}秒</h3>
    </template>
  </mars-dialog>

  <mars-dialog :visible="showComputer" left="10" top="10" width="400">
    等高线计算过程展示 <br />
    <ul class="contentUl">
      <li>完成地性线的连接工作后，即可在同一坡度的两相邻点之间内插出每整米高程的等高线通过点。</li>
      <li>前提：相邻点等坡度, 原理：比例内插</li>
      <li><img src="/img/jiaoben/dgx1.jpg" style="height: 150px" /></li>
      <li>
        假设ab间的坡度是均匀的，则根据a和b点间的高差为6.4m，ab线上图上的平距为48mm，由a点到22m等高线的高差为0.8m，由b点到27m等高线的高差为0.6m，则由a点到22m等高线及由b点到27m等高线的线长，x1和x2可以根据相似三角形状原理得到如下关系式
      </li>
      <li><img src="/img/jiaoben/dgx2.jpg" style="height: 80px" /></li>
    </ul>
  </mars-dialog>

  <mars-dialog :visible="contourDraw" left="10" top="10" width="400">
    等高线通过点绘制 <br /><img src="/img/jiaoben/dgx3.jpg" style="width: 100%" />
  </mars-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import * as mapWork from "./map.js"

const isPlay = ref(false)
const isPause = ref(false)
const totalTimes = ref("")
const currentWork = ref("")
const counter = ref(0)
const selectedKeys = ref<any[]>([])
let animations: any[] = []
let currentIndex = 0
let timer: any = null
let interval: any = null

const showComputer = ref(false)
const contourDraw = ref(false)

const play = () => {
  isPlay.value = true
  isPause.value = false
  start()
}
const pause = () => {
  clearTimeout(timer)
  currentIndex--
  mapWork.cancelFlight()
  mapWork.stopRotatePoint()
  isPause.value = true
}
const stop = () => {
  isPlay.value = false
  isPause.value = false
  currentIndex = 0
  mapWork.cancelFlight()
  mapWork.stopRotatePoint()
  mapWork.clear()
  clearTimeout(timer)
  clearInterval(interval)
}

const start = () => {
  if (timer) {
    clearTimeout(timer)
  }
  if (interval) {
    clearInterval(interval)
  }
  if (currentIndex < animations.length) {
    const animate = animations[currentIndex]
    selectedKeys.value = [animate.key]
    currentWork.value = `${animate.title}(${animate.times}秒)`
    counter.value = animate.times
    countOn()
    animate.widget()
    currentIndex++
    timer = setTimeout(() => {
      start()
    }, animate.times * 1000)

    if (currentIndex === 10) {
      showComputer.value = true
      contourDraw.value = false
    } else if (currentIndex === 11) {
      showComputer.value = false
      contourDraw.value = true
    } else {
      showComputer.value = false
      contourDraw.value = false
    }
  } else {
    stop()
  }
}

const startBegin = (item: any) => {
  currentIndex = item.index
  play()
}

function countOn() {
  interval = setInterval(() => {
    counter.value--
    if (counter.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const treeData: any[] = [
  {
    title: "特征点",
    key: "01",
    children: [
      {
        title: "山顶点",
        key: "01-01",
        times: 6,
        widget() {
          mapWork.workPoint1Sdd()
        }
      },
      {
        title: "鞍部点",
        key: "01-02",
        times: 10,
        widget() {
          mapWork.workPoint2Abd()
        }
      },
      {
        title: "坡度变换点",
        key: "01-03",
        times: 6,
        widget() {
          mapWork.workPoint3Pdbhd()
        }
      },
      {
        title: "山脚点",
        key: "01-04",
        times: 6,
        widget() {
          mapWork.workPoint4Sjd()
        }
      },
      {
        title: "山脚坡度变换点",
        key: "01-05",
        times: 6,
        widget() {
          mapWork.workPoint5Sjpdbhd()
        }
      },
      {
        title: "倾斜变换点",
        key: "01-06",
        times: 6,
        widget() {
          mapWork.workPoint6Qxbhd()
        }
      }
    ]
  },
  {
    title: "特征线",
    key: "02",
    children: [
      {
        title: "山脊线",
        key: "02-01",
        times: 6,
        widget() {
          mapWork.workLine1Sjx()
        }
      },
      {
        title: "山谷线",
        key: "02-02",
        times: 8,
        widget() {
          mapWork.workLine2Sgx()
        }
      },
      {
        title: "俯瞰",
        key: "02-03",
        times: 5,
        widget() {
          mapWork.workLine3Fk()
        }
      }
    ]
  },
  {
    title: "绘制过程",
    key: "03",
    children: [
      {
        title: "计算通过点",
        key: "03-01",
        times: 6,
        widget() {
          mapWork.workDgx1Point()
        }
      },
      {
        title: "等高线绘制",
        key: "03-02",
        times: 6,
        widget() {
          mapWork.workDgx2Line()
        }
      },
      {
        title: "等高线结果",
        key: "03-03",
        times: 10,
        widget() {
          mapWork.workDgx3End()
        }
      }
    ]
  }
]

onMounted(() => {
  let i = 0
  let time = 0
  treeData.forEach((item) => {
    animations = animations.concat(
      item.children.map((it: any) => {
        time += it.times
        it.index = i
        i++
        return it
      })
    )
  })
  totalTimes.value = `${Math.floor(time / 60)}分${time % 60}秒`
})
</script>

<style scoped lang="less">
.show-time {
  color: var(--mars-base-color);
}

.contentUl {
  padding: 0;
  text-align: left;
  font-size: 20px;
  margin-left: 10px;
}

.btn i {
  margin-right: 5px;
}
</style>
