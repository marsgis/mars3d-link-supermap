import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let tiles3dLayer

// 自定义事件
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function removeLayer() {
  if (tiles3dLayer) {
    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

export function showModel(url) {
  removeLayer()

  if (!url) {
    globalMsg("请输入图层URL！")
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "模型名称",
    url: url,
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    popup: "all",
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 加载完成事件
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    eventTarget.fire("tiles3dLayerLoad", { layer: tiles3dLayer })
  })

  // 加载完成事件
  tiles3dLayer.on(mars3d.EventType.updatePosition, function (event) {
    eventTarget.fire("changePoition", {
      center: tiles3dLayer.center,
      rotation: tiles3dLayer.rotation
    })
  })

  tiles3dLayer.bindContextMenu([
    {
      text: "开始编辑",
      icon: "fa fa-edit",
      show: function (e) {
        return !tiles3dLayer.isEditing
      },
      callback: (e) => {
        tiles3dLayer.startEditing()
      }
    }
    // {
    //   text: "停止编辑",
    //   icon: "fa fa-edit",
    //   show: function (e) {
    //     return tiles3dLayer.isEditing
    //   },
    //   callback: (e) => {
    //     tiles3dLayer.stopEditing()
    //   }
    // }
  ])
}

// 异步求准确高度
export function updateHeightForSurfaceTerrain(position) {
  // 求地面海拔 (异步)
  if (Cesium.defined(position) && Cesium.defined(position.alt)) {
    // 存在历史设置的高度时不用处理
  } else {
    mars3d.PointUtil.getSurfaceTerrainHeight(map.scene, tiles3dLayer.orginCenterPosition).then((result) => {
      if (!Cesium.defined(result.height)) {
        return
      }
      const offsetZ = Math.ceil(result.height - tiles3dLayer.orginCenterPoint.alt + 1)
      console.log("地面海拔：" + result.height.toFixed(2) + ",需要偏移" + offsetZ)

      tiles3dLayer.height = offsetZ

      eventTarget.fire("changeHeight", { alt: offsetZ })
    })
  }
}

// 修改更改后的参数
export function updateModel(params, pannelData) {
  tiles3dLayer.setOptions(params)

  // 非参数，调用方法绑定或解绑
  if (pannelData.highlightEnable) {
    tiles3dLayer.highlight = {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      outlineEffect: true, // 采用OutlineEffect方式来高亮
      color: "#00FF00"
    }
  } else {
    tiles3dLayer.highlight = undefined
  }
  if (pannelData.popupEnable) {
    tiles3dLayer.bindPopup("all")
  } else {
    tiles3dLayer.unbindPopup()
  }
}

// 深度检测
export function updateDepthTest(enabled) {
  map.scene.globe.depthTestAgainstTerrain = enabled
}

export function locate() {
  if (tiles3dLayer.tileset?.boundingSphere) {
    map.camera.flyToBoundingSphere(tiles3dLayer.tileset.boundingSphere, {
      offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, tiles3dLayer.tileset.boundingSphere.radius * 2)
    })
  } else {
    map.flyToPoint(tiles3dLayer.position, {
      radius: tiles3dLayer.tileset.boundingSphere.radius * 2
    })
  }
}

// 保存GeoJSON
export function saveBookmark(params) {
  // 清理参数中无需保存的部分
  if (params.position.lat === tiles3dLayer.orginCenterPoint.lat) {
    delete params.position.lat
  }
  if (params.position.lng === tiles3dLayer.orginCenterPoint.lng) {
    delete params.position.lng
  }
  if (params.position.alt === tiles3dLayer.orginCenterPoint.alt) {
    delete params.position.alt
  }
  if (Object.keys(params.position).length === 0) {
    delete params.position
  }

  if (params.rotation.x === 0) {
    delete params.rotation.x
  }
  if (params.rotation.y === 0) {
    delete params.rotation.y
  }
  if (params.rotation.z === 0) {
    delete params.rotation.z
  }
  if (Object.keys(params.rotation).length === 0) {
    delete params.rotation
  }
  if (params.maximumScreenSpaceError === 16) {
    delete params.maximumScreenSpaceError
  }
  if (params.scale === 1) {
    delete params.scale
  }
  if (params.axis === "" || !params.axis) {
    delete params.axis
  }
  if (!params.proxy) {
    delete params.proxy
  }
  if (params.opacity === 1) {
    delete params.opacity
  }

  mars3d.Util.downloadFile("3dtiles图层配置.json", JSON.stringify(params))
}

// 查看构件
export function checkedTree() {
  tiles3dLayer.tileset.style = undefined
}

export function showCompTree(model) {
  querySceneTreeData(model)
    .then(function (scene) {
      const data = []
      if (scene.scenes) {
        for (let i = 0; i < scene.scenes.length; i++) {
          const node = scene.scenes[i]
          name2text(node)
          data.push(node)
        }
      } else {
        name2text(scene)
        data.push(scene)
      }

      eventTarget.fire("compTree", { data })
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

export function compModelChange(nodeid, nodesphere) {
  if (nodesphere[3] <= 0) {
    return
  }
  // 构件节点位置
  let center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2])

  // 获取构件节点位置，现对于原始矩阵变化后的新位置
  center = tiles3dLayer.getPositionByOrginMatrix(center)

  // 飞行过去
  const sphere = new Cesium.BoundingSphere(center, nodesphere[3])
  map.camera.flyToBoundingSphere(sphere, {
    offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, nodesphere[3] * 1.5),
    duration: 0.5
  })

  // 设置tileset的样式
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${id} ==='" + nodeid + "'", "rgb(255, 255, 255)"],
        ["true", "rgba(255, 200, 200,0.2)"]
      ]
    }
  })
}

// 取构件树数据
function querySceneTreeData(url) {
  const scenetree = url.substring(0, url.lastIndexOf("/") + 1) + "scenetree.json"

  return mars3d.Util.fetchJson({ url: scenetree })
}

function name2text(o) {
  o.text = o.name

  // 这块为了避免tree控件里的id不统一，所以加改变一下
  o.eleid = o.id
  o.id = undefined

  if ((!o.text || o.text.trim() === "") && o.type) {
    o.text = o.type
  }

  if (o.children) {
    for (let i = 0; i < o.children.length; i++) {
      name2text(o.children[i])
    }
  }
}
