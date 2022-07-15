import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.835256, lng: 117.219292, alt: 128, heading: 120, pitch: -41 },
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

  globalNotify("操作提示", `W 前进、S 后退、 A 左转弯、D 右转弯`)
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
  const center = Cesium.Cartesian3.fromDegrees(117.220206, 31.834866, 50)
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)

  const meshVisualizer = new Cesium.MeshVisualizer({
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

  Cesium.Cartesian3.prototype.set = function (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  Cesium.Quaternion.prototype.set = function (x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  Ammo().then(function () {
    // - Global variables -
    const DISABLE_DEACTIVATION = 4
    const TRANSFORM_AUX = new Ammo.btTransform()
    const ZERO_QUATERNION = new Cesium.Quaternion(0, 0, 0, 1)

    // Graphics variables
    let materialDynamic, materialStatic, materialInteractive

    // Physics variables
    let collisionConfiguration
    let dispatcher
    let broadphase
    let solver
    let physicsWorld

    const syncList = []
    let time = 0
    const objectTimePeriod = 3
    const timeNextSpawn = time + objectTimePeriod
    const maxNumObjects = 30

    // Keybord actions
    const actions = {}
    const keysActions = {
      KeyW: "acceleration",
      KeyS: "braking",
      KeyA: "left",
      KeyD: "right"
    }

    // - Functions -

    function initGraphics() {
      materialDynamic = createMaterial()
      materialStatic = createMaterial()
      materialInteractive = createMaterial()

      window.addEventListener("keydown", keydown)
      window.addEventListener("keyup", keyup)
    }

    function initPhysics() {
      // Physics configuration
      collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
      broadphase = new Ammo.btDbvtBroadphase()
      solver = new Ammo.btSequentialImpulseConstraintSolver()
      physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration)
      physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0))
    }

    function updatePhysics(deltTime) {
      for (let i = 0; i < syncList.length; i++) {
        syncList[i](deltTime)
      }
      physicsWorld.stepSimulation(deltTime, 10)
      time += deltTime
    }

    function keyup(e) {
      if (keysActions[e.code]) {
        actions[keysActions[e.code]] = false
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    function keydown(e) {
      if (keysActions[e.code]) {
        actions[keysActions[e.code]] = true
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    function createBox(pos, quat, w, l, h, mass, friction) {
      const material = createMaterial() //= mass > 0 ? materialDynamic : materialStatic;
      const shape = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(w, l, h),
        vertexFormat: new Cesium.VertexFormat({
          position: true,
          normal: true
        })
      })

      const geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5))

      if (!mass) {
        mass = 0
      }
      if (!friction) {
        friction = 1
      }

      const mesh = new Cesium.Mesh(shape, material)
      Cesium.Cartesian3.clone(pos, mesh.position)
      mesh.quaternion = new Cesium.Quaternion(quat.x, quat.y, quat.z, quat.w)
      meshVisualizer.add(mesh)

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
      const motionState = new Ammo.btDefaultMotionState(transform)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      geometry.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia)
      const body = new Ammo.btRigidBody(rbInfo)

      body.setFriction(friction)
      // body.setRestitution(.9);
      // body.setDamping(0.2, 0.2);

      physicsWorld.addRigidBody(body)

      if (mass > 0) {
        body.setActivationState(DISABLE_DEACTIVATION)
        // Sync physics and graphics
        // eslint-disable-next-line no-inner-declarations
        function sync(dt) {
          const ms = body.getMotionState()
          if (ms) {
            ms.getWorldTransform(TRANSFORM_AUX)
            const p = TRANSFORM_AUX.getOrigin()
            const q = TRANSFORM_AUX.getRotation()
            mesh.position.set(p.x(), p.y(), p.z())
            mesh.quaternion.set(q.x(), q.y(), q.z(), q.w())
            mesh.modelMatrixNeedsUpdate = true
          }
        }

        syncList.push(sync)
      }
    }

    function createWheelMesh(radius, width) {
      const t = new Cesium.CylinderGeometry({
        length: width,
        topRadius: radius,
        bottomRadius: radius,
        slices: 24
      })
      // let t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);

      const mesh = new Cesium.Mesh(t, materialInteractive)
      Cesium.GeometryUtils.rotateY(mesh.geometry, Math.PI / 2)
      mesh.quaternion = new Cesium.Quaternion() // Cesium.Quaternion.fromAxisAngle(new Cesium.Cartesian3(0, 0, 1), Math.PI / 2);

      const shape = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(width * 1.5, radius * 1.75, radius * 0.25),
        vertexFormat: new Cesium.VertexFormat({
          position: true,
          normal: true
        })
      })
      const meshShape = new Cesium.Mesh(shape, materialInteractive)

      meshShape.quaternion = new Cesium.Quaternion() // .fromAxisAngle(new Cesium.Cartesian3(0, 0, 1), 0);
      mesh.add(meshShape)
      meshVisualizer.add(mesh)
      return mesh
    }

    function createChassisMesh(w, l, h) {
      const shape = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(w, l, h),
        vertexFormat: new Cesium.VertexFormat({
          position: true,
          normal: true
        })
      })

      const mesh = new Cesium.Mesh(shape, materialInteractive)
      mesh.quaternion = new Cesium.Quaternion(0, 0, 0, 1)
      meshVisualizer.add(mesh)
      return mesh
    }

    function createVehicle(pos, quat) {
      // Vehicle contants

      const chassisWidth = 1.8
      const chassisHeight = 0.6
      const chassisLength = 4
      const massVehicle = 800

      const wheelAxisPositionBack = -1
      const wheelRadiusBack = 0.4
      const wheelWidthBack = 0.3
      const wheelHalfTrackBack = 1
      const wheelAxisHeightBack = 0.3

      const wheelAxisFrontPosition = 1.7
      const wheelHalfTrackFront = 1
      const wheelAxisHeightFront = 0.3
      const wheelRadiusFront = 0.35
      const wheelWidthFront = 0.2

      const friction = 1000
      const suspensionStiffness = 20.0
      const suspensionDamping = 2.3
      const suspensionCompression = 4.4
      const suspensionRestLength = 0.6
      const rollInfluence = 0.2

      const steeringIncrement = 0.04
      const steeringClamp = 0.5
      const maxEngineForce = 2000
      const maxBreakingForce = 100

      // Chassis
      const geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * 0.5, chassisHeight * 0.5, chassisLength * 0.5))
      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
      const motionState = new Ammo.btDefaultMotionState(transform)
      const localInertia = new Ammo.btVector3(0, 0, 0)
      geometry.calculateLocalInertia(massVehicle, localInertia)
      const body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia))
      body.setActivationState(DISABLE_DEACTIVATION)
      physicsWorld.addRigidBody(body)
      const chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength)

      // Raycast Vehicle
      let engineForce = 0
      let vehicleSteering = 0
      let breakingForce = 0
      const tuning = new Ammo.btVehicleTuning()
      const rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld)
      const vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster)
      vehicle.setCoordinateSystem(0, 1, 2)
      physicsWorld.addAction(vehicle)

      // Wheels
      const FRONT_LEFT = 0
      const FRONT_RIGHT = 1
      const BACK_LEFT = 2
      const BACK_RIGHT = 3
      const wheelMeshes = []
      const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0)
      const wheelAxleCS = new Ammo.btVector3(-1, 0, 0)

      function addWheel(isFront, pos, radius, width, index) {
        const wheelInfo = vehicle.addWheel(pos, wheelDirectionCS0, wheelAxleCS, suspensionRestLength, radius, tuning, isFront)

        wheelInfo.set_m_suspensionStiffness(suspensionStiffness)
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping)
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression)
        wheelInfo.set_m_frictionSlip(friction)
        wheelInfo.set_m_rollInfluence(rollInfluence)

        wheelMeshes[index] = createWheelMesh(radius, width)
      }

      addWheel(
        true,
        new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
        wheelRadiusFront,
        wheelWidthFront,
        FRONT_LEFT
      )
      addWheel(
        true,
        new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
        wheelRadiusFront,
        wheelWidthFront,
        FRONT_RIGHT
      )
      addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT)
      addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT)

      // Sync keybord actions and physics and graphics
      function sync(dt) {
        const speed = vehicle.getCurrentSpeedKmHour()

        breakingForce = 0
        engineForce = 0

        if (actions.acceleration) {
          if (speed < -1) {
            breakingForce = maxBreakingForce
          } else {
            engineForce = maxEngineForce
          }
        }
        if (actions.braking) {
          if (speed > 1) {
            breakingForce = maxBreakingForce
          } else {
            engineForce = -maxEngineForce / 2
          }
        }
        if (actions.left) {
          if (vehicleSteering < steeringClamp) {
            vehicleSteering += steeringIncrement
          }
        } else {
          if (actions.right) {
            if (vehicleSteering > -steeringClamp) {
              vehicleSteering -= steeringIncrement
            }
          } else {
            if (vehicleSteering < -steeringIncrement) {
              vehicleSteering += steeringIncrement
            } else {
              if (vehicleSteering > steeringIncrement) {
                vehicleSteering -= steeringIncrement
              } else {
                vehicleSteering = 0
              }
            }
          }
        }

        vehicle.applyEngineForce(engineForce, BACK_LEFT)
        vehicle.applyEngineForce(engineForce, BACK_RIGHT)

        vehicle.setBrake(breakingForce / 2, FRONT_LEFT)
        vehicle.setBrake(breakingForce / 2, FRONT_RIGHT)
        vehicle.setBrake(breakingForce, BACK_LEFT)
        vehicle.setBrake(breakingForce, BACK_RIGHT)

        vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT)
        vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT)

        let tm, p, q, i
        const n = vehicle.getNumWheels()
        for (i = 0; i < n; i++) {
          vehicle.updateWheelTransform(i, true)
          tm = vehicle.getWheelTransformWS(i)
          p = tm.getOrigin()
          q = tm.getRotation()
          wheelMeshes[i].position.set(p.x(), p.y(), p.z())
          wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w())

          wheelMeshes[i].modelMatrixNeedsUpdate = true
        }

        tm = vehicle.getChassisWorldTransform()
        p = tm.getOrigin()
        q = tm.getRotation()
        chassisMesh.position.set(p.x(), p.y(), p.z())
        chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w())
        chassisMesh.modelMatrixNeedsUpdate = true
      }

      syncList.push(sync)
    }

    function createObjects() {
      createBox(new Cesium.Cartesian3(0, -0.5, 0), ZERO_QUATERNION, 75, 1, 75, 0, 2)

      const quaternion = new Cesium.Quaternion(0, 0, 0, 1)
      Cesium.Quaternion.fromAxisAngle(new Cesium.Cartesian3(1, 0, 0), -Math.PI / 18, quaternion)
      createBox(new Cesium.Cartesian3(0, -1.5, 0), quaternion, 8, 4, 10, 0)

      const size = 0.75
      const nw = 8
      const nh = 6
      for (let j = 0; j < nw; j++) {
        for (let i = 0; i < nh; i++) {
          createBox(new Cesium.Cartesian3(size * j - (size * (nw - 1)) / 2, size * i, 10), ZERO_QUATERNION, size, size, size, 10)
        }
      }

      createVehicle(new Cesium.Cartesian3(0, 4, -20), ZERO_QUATERNION)
    }

    let start = false
    let init = false
    let startTime = new Date()
    function update(frameState) {
      const deltaTime = (new Date() - startTime) / 1000.0
      updatePhysics(deltaTime)
      startTime = new Date()
    }
    setTimeout(function () {
      if (!init) {
        // - Init -
        initGraphics()
        initPhysics()
        createObjects()
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
}

function createRandomColor() {
  return Cesium.Color.fromRandom({ alpha: 1 }) // fromRgba(Math.floor(Math.random() * (1 << 24)));
}
function createMaterial() {
  return new Cesium.MeshPhongMaterial({
    defaultColor: createRandomColor(),
    side: Cesium.MeshMaterial.Sides.DOUBLE,
    translucent: false
  })
}
