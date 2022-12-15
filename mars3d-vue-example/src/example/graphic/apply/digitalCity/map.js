import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.215956, lng: 121.508605, alt: 887, heading: 5, pitch: -26 }
  },
  layers: [
    {
      type: "3dtiles",
      name: "上海市建筑物",
      url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
      maximumScreenSpaceError: 1,
      maximumMemoryUsage: 1024,
      style: {
        color: "rgb(0, 99, 255)"
      },
      marsJzwStyle: true,
      popup: [
        { field: "objectid", name: "编号" },
        { field: "name", name: "名称" },
        { field: "height", name: "楼高", unit: "米" }
      ],
      // 裁剪区域
      planClip: {
        positions: [
          [121.477666, 31.217061, 19.1],
          [121.531567, 31.217061, 19.1],
          [121.531567, 31.258551, 19.1],
          [121.477666, 31.258551, 19.1]
        ],
        clipOutSide: true
      },
      show: true
    },
    {
      type: "geojson",
      name: "市区一级道路",
      url: "//data.mars3d.cn/file/geojson/shanghai-road.json",
      symbol: {
        styleOptions: {
          width: 2.0,
          materialType: mars3d.MaterialType.ODLine,
          materialOptions: {
            bgColor: new Cesium.Color(0.1, 0.7, 0.5, 0.4),
            color: new Cesium.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 0.0, 1.0),
            speed: 20 + 1.0 * Math.random(),
            startTime: Math.random()
          }
        }
      },
      popup: "{Name}",
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 切换到蓝色底图

  // 特效
  const bloomEffect = new mars3d.effect.BloomEffect({
    enabled: true
  })
  map.addEffect(bloomEffect)

  // // 围绕旋转
  // const rotatePoint = new mars3d.thing.RotatePoint({
  //   direction: true, // 方向 true逆时针，false顺时针
  //   time: 50 // 给定飞行一周所需时间(单位 秒)，控制速度
  // })
  // map.addThing(rotatePoint)

  // 添加矢量数据
  addCityGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addCityGraphics() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 模型的中心点
  const position = [121.510608, 31.234322, 0] // 用于围绕旋转 + 中心点扩散 + 旋转的图片
  const center = Cesium.Cartesian3.fromDegrees(position[0], position[1], 140) // 用于div标注和远眺的线

  // 中心扩散点
  const circleDiffuseWallGlow = new mars3d.graphic.DiffuseWall({
    name: "中心扩散点",
    position: position,
    style: {
      diffHeight: 500, // 高度
      radius: 150, // 半径
      color: "#7ffeff",
      speed: 6 // 速度
    }
  })
  graphicLayer.addGraphic(circleDiffuseWallGlow)

  // 旋转的图片 -- 中心围墙
  const WallImagePositions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: position,
    radius: 50, // 半径
    count: 50 // 共返回(count*4)个点
  })
  const rotatWallImage = new mars3d.graphic.WallPrimitive({
    positions: WallImagePositions,
    style: {
      diffHeight: 190,
      closure: true,
      materialType: mars3d.MaterialType.RectSlide,
      materialOptions: {
        image: "img/tietu/circular.png",
        speed: 2
      }
    }
  })
  graphicLayer.addGraphic(rotatWallImage)

  // 旋转的图片 -- 底部
  let rotation = Cesium.Math.toRadians(50)
  function getRotationValue() {
    rotation -= 0.007
    return rotation
  }
  const rotatCicleImage = new mars3d.graphic.CircleEntity({
    position: position,
    style: {
      radius: 500,
      height: 50,
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "/img/textures/circle-two.png"
      },
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    }
  })
  graphicLayer.addGraphic(rotatCicleImage)

  // gltf的方式：四面体
  // const graphic = new mars3d.graphic.ModelEntity({
  //   name: "四面体",
  //   position: [position[0], position[1], 180],
  //   style: {
  //     url: "//data.mars3d.cn/gltf/mars/zhui.glb",
  //     scale: 30
  //   }
  // })
  // graphicLayer.addGraphic(graphic)
  // 开始 自旋转效果
  // graphic.rotateStart({
  //   direction: true, // 控制方向, true逆时针，false顺时针
  //   time: 6 // time：给定飞行一周所需时间(单位 秒)，控制速度
  // })

  // 四面体
  const tetrahedron = new mars3d.graphic.Tetrahedron({
    position: [position[0], position[1], 180],
    style: {
      width: 20,
      height: 30,
      color: "rgba(200,200,0,0.7)",
      moveHeight: 50
    }
  })
  graphicLayer.addGraphic(tetrahedron)

  // divgraphic标注
  const divgraphic = new mars3d.graphic.DivGraphic({
    position: center,
    style: {
      html: `<div class="marsBlackPanel">
          <div class="marsBlackPanel-text">Mars3D国际大厦</div>
      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 横向定位
      verticalOrigin: Cesium.VerticalOrigin.CENTER // 垂直定位
    }
  })
  graphicLayer.addGraphic(divgraphic)

  // 扫描圆形
  const scanCircle = new mars3d.graphic.CircleEntity({
    position: Cesium.Cartesian3.fromDegrees(121.501618, 31.235704, 24.2),
    style: {
      radius: 480.0,
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "/img/textures/circle-scan.png",
        color: "#ffffff"
      },
      stRotation: new Cesium.CallbackProperty(getRotationValue, false),
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(scanCircle)

  // 远眺的线 ,数据获取的pointArr
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/shanghai-point.json" })
    .then((result) => {
      const pointArr = []
      result.features.forEach((obj) => {
        pointArr.push({
          name: obj.properties.Name,
          point: obj.geometry.coordinates
        })
      })

      const lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.ODLine, {
        color: new Cesium.Color(1, 1, 1),
        bgColor: new Cesium.Color(0.1, 0.7, 0.5, 0.4),
        speed: 5 + 1.0 * Math.random(),
        startTime: Math.random()
      })

      for (let i = 0, len = pointArr.length; i < len; i++) {
        const item = pointArr[i]

        const color = ["#ffff00", "#81d8ff", "#fff9ed"]
        const thisPoint = Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], 1)
        const positions = mars3d.PolyUtil.getLinkedPointList(center, thisPoint, 40000, 100) // 计算曲线点

        const graphic = new mars3d.graphic.PolylinePrimitive({
          positions: positions,
          style: {
            width: 4,
            material: lineMaterial // 动画线材质
          }
        })
        graphic.bindPopup(item.name)
        graphicLayer.addGraphic(graphic)

        // 圆椎体
        const coneGlow = new mars3d.graphic.LightCone({
          position: Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], 10),
          style: {
            radius: 10,
            height: 200,
            color: color[i % color.length]
          },
          popup: item.name
        })
        graphicLayer.addGraphic(coneGlow)
      }
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })

  // 竖直飞线
  const arrData = []
  for (let j = 0; j < 100; ++j) {
    const startPt = randomPoint()

    const endPt = startPt.clone()
    endPt.alt = random(600, 1000)

    const startTime = random(0, 10000)
    const speed = random(1, 35)

    arrData.push({
      positions: [startPt, endPt],
      style: {
        width: 1,
        materialType: mars3d.MaterialType.ODLine,
        materialOptions: {
          color: "rgb(255, 255, 2)",
          bgColor: "rgb(255,255,255,0.01)",
          startTime: startTime,
          speed: speed
        }
      }
    })
  }
  const upPoly = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(upPoly)
}

// 取区域内的随机图标；用于线对象的合并渲染
function randomPoint() {
  const jd = random(121.500525 * 1000, 121.518298 * 1000) / 1000
  const wd = random(31.231515 * 1000, 31.24228 * 1000) / 1000
  return new mars3d.LngLatPoint(jd, wd, 50)
}

// 取随机数字
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
