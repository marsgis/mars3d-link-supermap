import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.834317, lng: 117.2199, alt: 87, heading: 30, pitch: -29 },
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

  globalNotify("操作提示", `鼠标左键单击进行发射`)
  addDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemo() {
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

  function createRandomColor() {
    return Cesium.Color.fromRandom({ alpha: 1 }) // fromRgba(Math.floor(Math.random() * (1 << 24)));
  }
  function createMaterial(color) {
    if (typeof color === "string") {
      //
    } else if (Cesium.defined(color)) {
      color = Cesium.Color.fromRgba(color).withAlpha(1)
    } else {
      color = createRandomColor()
    }
    return new Cesium.MeshPhongMaterial({
      defaultColor: color,
      side: Cesium.MeshMaterial.Sides.DOUBLE,
      translucent: false
    })
  }
  // const groundMaterial = new Cesium.MeshPhongMaterial({
  //   defaultColor: "rgb(255,0,0)",
  //   side: Cesium.MeshMaterial.Sides.DOUBLE,
  //   translucent: false
  // })
  Cesium.Cartesian3.prototype.set = function (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  Cesium.Cartesian2.prototype.set = function (x, y) {
    this.x = x
    this.y = y
  }
  Cesium.Quaternion.prototype.set = function (x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  Ammo().then(function () {
    // - Global variables -

    // Graphics variables
    // const clock = new THREE.Clock()

    const mouseCoords = new THREE.Vector2()
    // const raycaster = new THREE.Raycaster()
    const ballMaterial = createMaterial(0x202020)

    // Physics variables
    const gravityConstant = 7.8
    let collisionConfiguration
    let dispatcher
    let broadphase
    let solver
    let physicsWorld
    const margin = 0.05

    const convexBreaker = new THREE.ConvexObjectBreaker()

    // Rigid bodies include all movable objects
    const rigidBodies = []

    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const transformAux1 = new Ammo.btTransform()
    const tempBtVec3_1 = new Ammo.btVector3(0, 0, 0)

    // const time = 0

    const objectsToRemove = []
    for (let i = 0; i < 500; i++) {
      objectsToRemove[i] = null
    }
    let numObjectsToRemove = 0

    const impactPoint = new THREE.Vector3()
    const impactNormal = new THREE.Vector3()

    function initPhysics() {
      // Physics configuration

      collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
      broadphase = new Ammo.btDbvtBroadphase()
      solver = new Ammo.btSequentialImpulseConstraintSolver()
      physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration)
      physicsWorld.setGravity(new Ammo.btVector3(0, -gravityConstant, 0))
    }

    function createObject(mass, halfExtents, pos, quat, material) {
      // y，z调换位置
      const object = new THREE.Mesh(new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2), material)
      object.position.copy(pos)
      object.quaternion.copy(quat)
      // object.position.y += 3;
      convexBreaker.prepareBreakableObject(object, mass, new THREE.Vector3(), new THREE.Vector3(), true)

      createDebrisFromBreakableObject(object)
    }

    function createObjects() {
      // Ground
      pos.set(0, -0.5, 0)
      quat.set(0, 0, 0, 1)
      const ground = createParalellepipedWithPhysics(40, 1, 40, 0, pos, quat, createMaterial(0xffffff))

      // Tower 1
      const towerMass = 1000
      const towerHalfExtents = new THREE.Vector3(2, 5, 2)
      pos.set(-8, 5, 0)
      quat.set(0, 0, 0, 1)
      createObject(towerMass, towerHalfExtents, pos, quat, createMaterial("rgb(247,174,68)"))

      // Tower 2
      pos.set(8, 5, 0)
      quat.set(0, 0, 0, 1)
      createObject(towerMass, towerHalfExtents, pos, quat, createMaterial("rgb(247,174,68)"))

      // Bridge
      const bridgeMass = 100
      const bridgeHalfExtents = new THREE.Vector3(7, 0.2, 1.5)
      pos.set(0, 10.2, 0)
      quat.set(0, 0, 0, 1)
      createObject(bridgeMass, bridgeHalfExtents, pos, quat, createMaterial("rgb(247,174,68)"))

      // Stones
      const stoneMass = 120
      const stoneHalfExtents = new THREE.Vector3(1, 2, 0.15)
      const numStones = 8
      quat.set(0, 0, 0, 1)
      for (let i = 0; i < numStones; i++) {
        pos.set(0, 2, 15 * (0.5 - i / (numStones + 1)))

        createObject(stoneMass, stoneHalfExtents, pos, quat, createMaterial(0xb0b0b0))
      }

      // Mountain
      const mountainMass = 860
      const mountainHalfExtents = new THREE.Vector3(4, 5, 4)
      pos.set(5, mountainHalfExtents.y * 0.5, -7)
      quat.set(0, 0, 0, 1)
      const mountainPoints = []
      // y，z调换位置
      mountainPoints.push(new THREE.Vector3(mountainHalfExtents.x, -mountainHalfExtents.y, mountainHalfExtents.z))
      mountainPoints.push(new THREE.Vector3(-mountainHalfExtents.x, -mountainHalfExtents.y, mountainHalfExtents.z))
      mountainPoints.push(new THREE.Vector3(mountainHalfExtents.x, -mountainHalfExtents.y, -mountainHalfExtents.z))
      mountainPoints.push(new THREE.Vector3(-mountainHalfExtents.x, -mountainHalfExtents.y, -mountainHalfExtents.z))
      mountainPoints.push(new THREE.Vector3(0, mountainHalfExtents.y, 0))
      const mountain = new THREE.Mesh(new THREE.ConvexGeometry(mountainPoints), createMaterial("rgb(247,174,68)"))
      mountain.position.copy(pos)
      mountain.quaternion.copy(quat)
      convexBreaker.prepareBreakableObject(mountain, mountainMass, new THREE.Vector3(), new THREE.Vector3(), true)
      createDebrisFromBreakableObject(mountain)
    }

    function createParalellepipedWithPhysics(sx, sy, sz, mass, pos, quat, material) {
      const box = Cesium.BoxGeometry.createGeometry(
        Cesium.BoxGeometry.fromDimensions({
          dimensions: new Cesium.Cartesian3(sx, sy, sz),
          vertexFormat: new Cesium.VertexFormat({
            position: true,
            normal: true
          })
        })
      )
      const object = new Cesium.Mesh(box, material)
      object.quaternion = new Cesium.Quaternion()
      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
      shape.setMargin(margin)

      createRigidBody(object, shape, mass, pos, quat)

      return object
    }

    function createDebrisFromBreakableObject(object) {
      object.castShadow = true
      object.receiveShadow = true

      const shape = createConvexHullPhysicsShape(object.geometry.vertices)
      shape.setMargin(margin)

      const body = createRigidBody(object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity)

      // Set pointer back to the three object only in the debris objects
      const btVecUserData = new Ammo.btVector3(0, 0, 0)
      btVecUserData.threeObject = object
      body.setUserPointer(btVecUserData)
    }

    function removeDebris(object) {
      meshVisualizer.remove(object)

      physicsWorld.removeRigidBody(object.userData.physicsBody)
    }

    function createConvexHullPhysicsShape(points) {
      const shape = new Ammo.btConvexHullShape()

      for (let i = 0, il = points.length; i < il; i++) {
        const p = points[i]
        tempBtVec3_1.setValue(p.x, p.y, p.z) // y,z调换位置
        const lastOne = i === il - 1
        shape.addPoint(tempBtVec3_1, lastOne)
      }

      return shape
    }

    function createRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {
      if (pos) {
        object.position.copy(pos)
      } else {
        pos = object.position
      }
      if (quat) {
        if (object.quaternion) {
          object.quaternion.copy(quat)
        }
      } else {
        quat = object.quaternion
      }

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
      const motionState = new Ammo.btDefaultMotionState(transform)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      physicsShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia)
      const body = new Ammo.btRigidBody(rbInfo)

      body.setFriction(0.5)

      if (vel) {
        body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z))
      }
      if (angVel) {
        body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z))
      }

      object.userData.physicsBody = body
      object.userData.collided = false

      meshVisualizer.add(object)

      if (mass > 0) {
        rigidBodies.push(object)

        // Disable deactivation
        body.setActivationState(4)
      }

      physicsWorld.addRigidBody(body)

      return body
    }

    function updatePhysics(deltaTime) {
      // Step world
      physicsWorld.stepSimulation(deltaTime, 10)

      // Update rigid bodies
      for (let i = 0, il = rigidBodies.length; i < il; i++) {
        const objThree = rigidBodies[i]
        const objPhys = objThree.userData.physicsBody
        const ms = objPhys.getMotionState()
        if (ms) {
          ms.getWorldTransform(transformAux1)
          const p = transformAux1.getOrigin()
          const q = transformAux1.getRotation()
          objThree.position.set(p.x(), p.y(), p.z())
          if (objThree.quaternion) {
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
          }

          objThree.userData.collided = false
          objThree.modelMatrixNeedsUpdate = true
        }
      }

      for (let i = 0, il = dispatcher.getNumManifolds(); i < il; i++) {
        const contactManifold = dispatcher.getManifoldByIndexInternal(i)
        const rb0 = contactManifold.getBody0()
        const rb1 = contactManifold.getBody1()

        const threeObject0 = Ammo.castObject(rb0.getUserPointer(), Ammo.btVector3).threeObject
        const threeObject1 = Ammo.castObject(rb1.getUserPointer(), Ammo.btVector3).threeObject

        if (!threeObject0 && !threeObject1) {
          continue
        }

        const userData0 = threeObject0 ? threeObject0.userData : null
        const userData1 = threeObject1 ? threeObject1.userData : null

        const breakable0 = userData0 ? userData0.breakable : false
        const breakable1 = userData1 ? userData1.breakable : false

        const collided0 = userData0 ? userData0.collided : false
        const collided1 = userData1 ? userData1.collided : false

        if ((!breakable0 && !breakable1) || (collided0 && collided1)) {
          continue
        }

        let contact = false
        let maxImpulse = 0
        for (let j = 0, jl = contactManifold.getNumContacts(); j < jl; j++) {
          const contactPoint = contactManifold.getContactPoint(j)
          if (contactPoint.getDistance() < 0) {
            contact = true
            const impulse = contactPoint.getAppliedImpulse()
            if (impulse > maxImpulse) {
              maxImpulse = impulse
              const pos = contactPoint.get_m_positionWorldOnB()
              const normal = contactPoint.get_m_normalWorldOnB()
              impactPoint.set(pos.x(), pos.y(), pos.z())
              impactNormal.set(normal.x(), normal.y(), normal.z())
            }
            break
          }
        }

        // If no point has contact, abort
        if (!contact) {
          continue
        }

        // Subdivision

        const fractureImpulse = 250

        if (breakable0 && !collided0 && maxImpulse > fractureImpulse) {
          const debris = convexBreaker.subdivideByImpact(threeObject0, impactPoint, impactNormal, 1, 2, 1.5)

          const numObjects = debris.length
          for (let j = 0; j < numObjects; j++) {
            createDebrisFromBreakableObject(debris[j])
          }

          objectsToRemove[numObjectsToRemove++] = threeObject0
          userData0.collided = true
        }

        if (breakable1 && !collided1 && maxImpulse > fractureImpulse) {
          const debris = convexBreaker.subdivideByImpact(threeObject1, impactPoint, impactNormal, 1, 2, 1.5)

          const numObjects = debris.length
          for (let j = 0; j < numObjects; j++) {
            createDebrisFromBreakableObject(debris[j])
          }

          objectsToRemove[numObjectsToRemove++] = threeObject1
          userData1.collided = true
        }
      }

      for (let i = 0; i < numObjectsToRemove; i++) {
        removeDebris(objectsToRemove[i])
      }
      numObjectsToRemove = 0
    }

    const ray = new Cesium.Ray()
    let clickRequest = false
    let start = false
    let hasInit = false
    let startTime = new Date()
    const rayDir = new Cesium.Cartesian3()

    function initInput() {
      const scene = map.scene
      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
      const lastMesh = null
      handler.setInputAction(function (movement) {
        if (!clickRequest) {
          Cesium.Cartesian2.clone(movement.position, mouseCoords)
          clickRequest = true
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    }

    function processClick() {
      if (clickRequest) {
        meshVisualizer.getPickRay(mouseCoords, ray)
        if (!ray) {
          clickRequest = false
          return
        }
        // Creates a ball
        const ballMass = 35
        const ballRadius = 0.4
        const ball = new Cesium.Mesh(
          new Cesium.SphereGeometry({
            radius: ballRadius,
            stackPartitions: 14,
            slicePartitions: 10
          }),
          ballMaterial
        )

        const ballShape = new Ammo.btSphereShape(ballRadius)
        ballShape.setMargin(margin)

        Cesium.Cartesian3.clone(ray.direction, rayDir)
        Cesium.Cartesian3.subtract(ray.origin, ray.direction, pos)

        quat.set(0, 0, 0, 1)
        const ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat)
        // ballBody.setFriction(0.5);

        Cesium.Cartesian3.normalize(rayDir, rayDir)
        Cesium.Cartesian3.multiplyByScalar(rayDir, 50, rayDir)
        ballBody.setLinearVelocity(new Ammo.btVector3(rayDir.x, rayDir.y, rayDir.z))

        clickRequest = false
      }
    }
    const hs = false
    function update(frameState) {
      if (hs) {
        return
      }
      const deltaTime = (new Date() - startTime) / 1000.0
      updatePhysics(deltaTime)
      processClick()
      startTime = new Date()
      // hs = true;
    }
    setTimeout(function () {
      if (!hasInit) {
        // - Init -

        initPhysics()

        createObjects()

        initInput()

        hasInit = true
      }
      if (!start) {
        startTime = new Date()
        meshVisualizer.beforeUpdate.addEventListener(update)
        start = true
      } else {
        meshVisualizer.beforeUpdate.removeEventListener(update)
        start = false
      }
    }, 1000 * 3)
  })
}
