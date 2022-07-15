import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.834535, lng: 117.21992, alt: 80, heading: 38, pitch: -34 },
    fxaa: true
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

  globalNotify("操作提示", `Q 逆时针摆动、 A 顺时针摆动`)
  creatDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function creatDemo() {
  const MeshVisualizer = Cesium.MeshVisualizer
  const Mesh = Cesium.Mesh
  const MeshMaterial = Cesium.MeshMaterial
  const GeometryUtils = Cesium.GeometryUtils
  const PlaneBufferGeometry = Cesium.PlaneBufferGeometry
  const MeshPhongMaterial = Cesium.MeshPhongMaterial

  const center = Cesium.Cartesian3.fromDegrees(117.220206, 31.834866, 50)
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)

  const meshVisualizer = new MeshVisualizer({
    modelMatrix: modelMatrix,
    up: { y: 1 },
    referenceAxisParameter: {
      length: 100,
      width: 0.05,
      headLength: 2,
      headWidth: 0.1
    }
  })
  map.scene.primitives.add(meshVisualizer)
  meshVisualizer.showReference = true // 显示坐标轴

  Ammo().then(function () {
    // Physics variables
    const gravityConstant = -9.8
    let collisionConfiguration
    let dispatcher
    let broadphase
    let solver
    let physicsWorld
    const rigidBodies = []
    const margin = 0.05
    let hinge
    let cloth
    const transformAux1 = new Ammo.btTransform()
    let armMovement = 0
    let softBodySolver

    function initPhysics() {
      // Physics configuration

      collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration()
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
      broadphase = new Ammo.btDbvtBroadphase()
      solver = new Ammo.btSequentialImpulseConstraintSolver()
      softBodySolver = new Ammo.btDefaultSoftBodySolver()
      physicsWorld = new Ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration, softBodySolver)
      physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0))
      physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, gravityConstant, 0))
    }

    function createRandomColor() {
      return Cesium.Color.fromRandom({ alpha: 1 }) // fromRgba(Math.floor(Math.random() * (1 << 24)));
    }
    function createMaterial() {
      return new MeshPhongMaterial({
        defaultColor: createRandomColor(),
        side: MeshMaterial.Sides.DOUBLE,
        translucent: false
      })
    }

    function createObjects() {
      const pos = new Cesium.Cartesian3()
      const quat = new Cesium.Quaternion()

      // Ground
      pos.x = 0
      pos.y = -0.5
      pos.z = 0
      quat.x = 0
      quat.y = 0
      quat.z = 0
      quat.w = 1
      const ground = createParalellepiped(
        40,
        1,
        40,
        0,
        pos,
        quat,
        new MeshPhongMaterial({
          defaultColor: "rgb(125,125,125)",
          side: MeshMaterial.Sides.DOUBLE,
          translucent: false
        })
      )

      // Wall
      const brickMass = 0.5
      const brickLength = 1.2
      const brickDepth = 0.6
      const brickHeight = brickLength * 0.5
      const numBricksLength = 6
      const numBricksHeight = 8
      const z0 = -numBricksLength * brickLength * 0.5

      pos.x = 0
      pos.y = brickHeight * 0.5
      pos.z = z0
      quat.x = 0
      quat.y = 0
      quat.z = 0
      quat.w = 1

      for (let j = 0; j < numBricksHeight; j++) {
        const oddRow = j % 2 === 1

        pos.z = z0

        if (oddRow) {
          pos.z -= 0.25 * brickLength
        }

        const nRow = oddRow ? numBricksLength + 1 : numBricksLength
        for (let i = 0; i < nRow; i++) {
          let brickLengthCurrent = brickLength
          let brickMassCurrent = brickMass
          if (oddRow && (i === 0 || i === nRow - 1)) {
            brickLengthCurrent *= 0.5
            brickMassCurrent *= 0.5
          }

          const brick = createParalellepiped(brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, createMaterial())

          if (oddRow && (i === 0 || i === nRow - 2)) {
            pos.z += 0.75 * brickLength
          } else {
            pos.z += brickLength
          }
        }
        pos.y += brickHeight
      }

      // The cloth
      // Cloth graphic object
      const clothWidth = 4
      const clothHeight = 3
      const clothNumSegmentsZ = clothWidth * 5
      const clothNumSegmentsY = clothHeight * 5
      const clothSegmentLengthZ = clothWidth / clothNumSegmentsZ
      const clothSegmentLengthY = clothHeight / clothNumSegmentsY
      const clothPos = new Cesium.Cartesian3(-3, 3, 2)

      const clothGeometry = new PlaneBufferGeometry(clothWidth, clothHeight, clothNumSegmentsZ, clothNumSegmentsY)

      const clothMaterial = new MeshPhongMaterial({
        defaultColor: "rgb(255,255,255)",
        side: MeshMaterial.Sides.DOUBLE,
        translucent: false
      })

      cloth = new Mesh(clothGeometry, clothMaterial)
      GeometryUtils.rotateY(cloth.geometry, Math.PI * 0.5)
      GeometryUtils.translate(cloth.geometry, clothPos.x, clothPos.y + clothHeight * 0.5, clothPos.z - clothWidth * 0.5)
      GeometryUtils.computeVertexNormals(cloth.geometry)
      meshVisualizer.add(cloth)

      // Cloth physic object
      const softBodyHelpers = new Ammo.btSoftBodyHelpers()
      const clothCorner00 = new Ammo.btVector3(clothPos.x, clothPos.y + clothHeight, clothPos.z)
      const clothCorner01 = new Ammo.btVector3(clothPos.x, clothPos.y + clothHeight, clothPos.z - clothWidth)
      const clothCorner10 = new Ammo.btVector3(clothPos.x, clothPos.y, clothPos.z)
      const clothCorner11 = new Ammo.btVector3(clothPos.x, clothPos.y, clothPos.z - clothWidth)
      const clothSoftBody = softBodyHelpers.CreatePatch(
        physicsWorld.getWorldInfo(),
        clothCorner00,
        clothCorner01,
        clothCorner10,
        clothCorner11,
        clothNumSegmentsZ + 1,
        clothNumSegmentsY + 1,
        0,
        true
      )
      const sbConfig = clothSoftBody.get_m_cfg()
      sbConfig.set_viterations(10)
      sbConfig.set_piterations(10)

      clothSoftBody.setTotalMass(0.9, false)
      Ammo.castObject(clothSoftBody, Ammo.btCollisionObject)
        .getCollisionShape()
        .setMargin(margin * 3)
      physicsWorld.addSoftBody(clothSoftBody, 1, -1)
      cloth.physicsBody = clothSoftBody
      // Disable deactivation
      clothSoftBody.setActivationState(4)

      // The base
      const armMass = 2
      const armLength = 3 + clothWidth
      const pylonHeight = clothPos.y + clothHeight
      const baseMaterial = new MeshPhongMaterial({
        defaultColor: "rgb(255,255,0)",
        side: MeshMaterial.Sides.DOUBLE,
        translucent: false
      })

      pos.x = clothPos.x
      pos.y = 0.1
      pos.z = clothPos.z - armLength
      quat.x = 0
      quat.y = 0
      quat.z = 0
      quat.w = 1
      const base = createParalellepiped(1, 0.2, 1, 0, pos, quat, baseMaterial)

      pos.x = clothPos.x
      pos.y = 0.5 * pylonHeight
      pos.z = clothPos.z - armLength

      const pylon = createParalellepiped(0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial)

      pos.x = clothPos.x
      pos.y = pylonHeight + 0.2
      pos.z = clothPos.z - 0.5 * armLength
      const arm = createParalellepiped(0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial)

      // Glue the cloth to the arm
      const influence = 0.5
      clothSoftBody.appendAnchor(0, arm.physicsBody, false, influence)
      clothSoftBody.appendAnchor(clothNumSegmentsZ, arm.physicsBody, false, influence)

      // Hinge constraint to move the arm
      const pivotA = new Ammo.btVector3(0, pylonHeight * 0.5, 0)
      const pivotB = new Ammo.btVector3(0, -0.2, -armLength * 0.5)
      const axis = new Ammo.btVector3(0, 1, 0)
      hinge = new Ammo.btHingeConstraint(pylon.physicsBody, arm.physicsBody, pivotA, pivotB, axis, axis, true)
      physicsWorld.addConstraint(hinge, true)
    }

    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
      const threeObject = new Mesh(
        Cesium.BoxGeometry.fromDimensions({
          dimensions: new Cesium.Cartesian3(sx, sy, sz),
          vertexFormat: new Cesium.VertexFormat({
            position: true,
            st: true,
            normal: true
          })
        }),
        material
      )

      threeObject.quaternion = new Cesium.Quaternion()
      threeObject.geometry.attributes.uv = threeObject.geometry.attributes.st
      threeObject.geometry.attributes.st = undefined
      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
      shape.setMargin(margin)

      createRigidBody(threeObject, shape, mass, pos, quat)

      return threeObject
    }

    function createRigidBody(threeObject, physicsShape, mass, pos, quat) {
      Cesium.Cartesian3.clone(pos, threeObject.position)
      Cesium.Quaternion.clone(quat, threeObject.quaternion)

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
      const motionState = new Ammo.btDefaultMotionState(transform)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      physicsShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia)
      const body = new Ammo.btRigidBody(rbInfo)

      threeObject.physicsBody = body

      meshVisualizer.add(threeObject)

      if (mass > 0) {
        rigidBodies.push(threeObject)

        // Disable deactivation
        body.setActivationState(4)
      }

      physicsWorld.addRigidBody(body)
    }

    // deltaTime单位是：秒/s
    function updatePhysics(deltaTime) {
      // Hinge control
      hinge.enableAngularMotor(true, 0.8 * armMovement, 50)

      // Step world
      physicsWorld.stepSimulation(deltaTime, 10)

      // Update cloth
      const softBody = cloth.physicsBody
      const clothPositions = cloth.geometry.attributes.position.values
      const numVerts = clothPositions.length / 3
      const nodes = softBody.get_m_nodes()
      let indexFloat = 0
      for (let i = 0; i < numVerts; i++) {
        const node = nodes.at(i)
        const nodePos = node.get_m_x()
        clothPositions[indexFloat++] = nodePos.x()
        clothPositions[indexFloat++] = nodePos.y()
        clothPositions[indexFloat++] = nodePos.z()
      }

      cloth.geometry.attributes.position.needsUpdate = true
      if (cloth.geometry.primitiveType === Cesium.PrimitiveType.TRIANGLES) {
        // Cesium.GeometryPipeline.computeNormal(cloth.geometry);
        GeometryUtils.computeVertexNormals(cloth.geometry)
      }

      // Update rigid bodies
      for (let i = 0, il = rigidBodies.length; i < il; i++) {
        const objGraph = rigidBodies[i]
        const objPhys = objGraph.physicsBody
        const ms = objPhys.getMotionState()
        if (ms) {
          ms.getWorldTransform(transformAux1)
          const p = transformAux1.getOrigin()
          const q = transformAux1.getRotation()
          objGraph.position.x = p.x()
          objGraph.position.y = p.y()
          objGraph.position.z = p.z()
          objGraph.quaternion.x = q.x()
          objGraph.quaternion.y = q.y()
          objGraph.quaternion.z = q.z()
          objGraph.quaternion.w = q.w()
          // objGraph.needsUpdate = true;
          objGraph.modelMatrixNeedsUpdate = true
        }
      }
    }

    let start = false
    function initInput() {
      window.addEventListener(
        "keydown",
        function (event) {
          if (!start) {
            return
          }
          switch (event.keyCode) {
            // Q
            case 81:
              armMovement = 1
              break

            // A
            case 65:
              armMovement = -1
              break
          }
        },
        false
      )

      window.addEventListener(
        "keyup",
        function (event) {
          armMovement = 0
        },
        false
      )
    }

    let startTime = new Date()
    function update(frameState) {
      const deltaTime = (new Date() - startTime) / 1000.0
      updatePhysics(deltaTime)
      startTime = new Date()
    }

    let init = false
    setTimeout(function () {
      if (!init) {
        initPhysics()

        createObjects()

        initInput()
        init = true
      }
      if (!start) {
        meshVisualizer.beforeUpdate.addEventListener(update)
        start = true
      } else {
        meshVisualizer.beforeUpdate.removeEventListener(update)
        start = false
      }
    }, 1000 * 3)
  })

  // });
}
