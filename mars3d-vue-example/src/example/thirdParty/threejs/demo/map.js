import * as mars3d from "mars3d"
import ThreeLayer from "./ThreeLayer"

export let map // mars3d.Map三维地图对象
let threeLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.980053, lng: 117.375049, alt: 110976, heading: 357, pitch: -50 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  threeLayer = new ThreeLayer()
  map.addLayer(threeLayer)

  init3DObject()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function init3DObject() {
  let minWGS84 = [117.142184, 31.869697]
  let maxWGS84 = [117.357015, 31.713898]
  const ce = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2 - 1, 200000)

  let geometry = new THREE.SphereGeometry(1, 32, 32)
  const sphere = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })) // 12面体

  // translate "up" in Three.js space so the "bottom" of the mesh is the handle
  sphere.scale.set(5000, 5000, 5000)
  sphere.uuid = "sphere"
  const sphereYup = new THREE.Group()
  sphereYup.add(sphere)
  threeLayer.scene.add(sphereYup) // don’t forget to add it to the Three.js scene manually
  sphereYup.position.set(ce.x, ce.y, ce.z)

  const arrXdObj = []

  let xdObj = new XDObject()
  xdObj.threeMesh = sphereYup
  xdObj.minWGS84 = minWGS84
  xdObj.maxWGS84 = maxWGS84
  arrXdObj.push(xdObj)

  geometry = new THREE.DodecahedronGeometry()
  const dodecahedronMesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial()) // 12面体
  dodecahedronMesh.scale.set(5000, 5000, 5000)
  dodecahedronMesh.position.z += 15000
  // translate "up" in Three.js space so the "bottom" of the mesh is the handle
  dodecahedronMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
  dodecahedronMesh.uuid = "12面体"

  const dodecahedronMeshYup = new THREE.Group()
  dodecahedronMeshYup.add(dodecahedronMesh)
  threeLayer.scene.add(dodecahedronMeshYup) // don’t forget to add it to the Three.js scene manually
  dodecahedronMeshYup.position.set(ce.x, ce.y, ce.z)

  //    Assign Three.js object mesh to our object array
  xdObj = new XDObject()
  xdObj.threeMesh = dodecahedronMeshYup
  xdObj.minWGS84 = minWGS84
  xdObj.maxWGS84 = maxWGS84
  arrXdObj.push(xdObj)

  // 添加灯光，点光源
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(0, 0, 50000)
  spotLight.castShadow = true // 设置光源投射阴影
  spotLight.intensity = 1
  sphereYup.add(spotLight)

  // 添加环境光
  const hemiLight = new THREE.HemisphereLight(0xff0000, 0xff0000, 1)
  sphereYup.add(hemiLight)

  const cartToVec = function (cart) {
    return new THREE.Vector3(cart.x, cart.y, cart.z)
  }

  // Configure Three.js meshes to stand against globe center position up direction
  for (const id in arrXdObj) {
    minWGS84 = arrXdObj[id].minWGS84
    maxWGS84 = arrXdObj[id].maxWGS84
    // convert lat/long center position to Cartesian3
    const center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2)

    // get forward direction for orienting model
    const centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2, 1)

    // use direction from bottom left to top left as up-vector
    const bottomLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]))
    const topLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]))
    const latDir = new THREE.Vector3().subVectors(bottomLeft, topLeft).normalize()

    // configure entity position and orientation
    arrXdObj[id].threeMesh.position.copy(center)
    arrXdObj[id].threeMesh.lookAt(centerHigh)
    arrXdObj[id].threeMesh.up.copy(latDir)
  }
}

function XDObject() {
  this.threeMesh = null
  this.minWGS84 = null
  this.maxWGS84 = null
}
