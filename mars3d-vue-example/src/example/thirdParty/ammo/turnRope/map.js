import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.83456, lng: 117.219861, alt: 83, heading: 46, pitch: -35 },
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
  const MeshVisualizer = Cesium.MeshVisualizer
  const Mesh = Cesium.Mesh
  const MeshMaterial = Cesium.MeshMaterial
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

  Cesium.Cartesian3.prototype.set = function (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  Cesium.Cartesian3.prototype.copy = function (src) {
    this.x = src.x
    this.y = src.y
    this.z = src.z
  }

  Cesium.Cartesian2.prototype.set = function (x, y) {
    this.x = x
    this.y = y
  }
  Cesium.Cartesian2.prototype.copy = function (src) {
    this.x = src.x
    this.y = src.y
  }
  Cesium.Quaternion.prototype.set = function (x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
  Cesium.Quaternion.prototype.copy = function (src) {
    this.x = src.x
    this.y = src.y
    this.z = src.z
    this.w = src.w
  }

  Ammo().then(function () {
    // - Global variables -

    // - Global variables -

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
    let rope
    const transformAux1 = new Ammo.btTransform()

    const time = 0
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

    function createObjects() {
      const pos = new Cesium.Cartesian3()
      const quat = new Cesium.Quaternion()

      // Ground
      pos.set(0, -0.5, 0)
      quat.set(0, 0, 0, 1)
      const ground = createParalellepiped(
        40,
        1,
        40,
        0,
        pos,
        quat,
        new MeshPhongMaterial({
          defaultColor: Cesium.Color.fromRgba(0xffffff).withAlpha(1), // "rgb(200,200,200)",
          side: MeshMaterial.Sides.DOUBLE,
          translucent: false
        })
      )
      ground.quaternion = null
      // Ball
      const ballMass = 1.2
      const ballRadius = 0.6

      const ball = new Mesh(
        new Cesium.SphereGeometry({
          radius: ballRadius,
          stackPartitions: 20,
          slicePartitions: 20
        }),
        new MeshPhongMaterial({
          defaultColor: Cesium.Color.fromRgba(0x000000).withAlpha(1),
          side: MeshMaterial.Sides.DOUBLE,
          translucent: false
        })
      )

      const ballShape = new Ammo.btSphereShape(ballRadius)
      ballShape.setMargin(margin)
      pos.set(-3, 2, 0)
      quat.set(0, 0, 0, 1)
      createRigidBody(ball, ballShape, ballMass, pos, quat)
      ball.physicsBody.setFriction(0.5)

      // Wall
      const brickMass = 0.5
      const brickLength = 1.2
      const brickDepth = 0.6
      const brickHeight = brickLength * 0.5
      const numBricksLength = 6
      const numBricksHeight = 8
      const z0 = -numBricksLength * brickLength * 0.5
      pos.set(0, brickHeight * 0.5, z0)
      quat.set(0, 0, 0, 1)
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

      // The rope
      // Rope graphic object
      const ropeNumSegments = 10
      const ropeLength = 4
      const ropeMass = 3
      const ropePos = ball.position.clone()
      ropePos.y += ballRadius

      const segmentLength = ropeLength / ropeNumSegments
      const ropeMaterial = new MeshMaterial({
        defaultColor: Cesium.Color.fromRgba(0x000000).withAlpha(1),
        side: MeshMaterial.Sides.DOUBLE,
        translucent: false,
        wireframe: true
      })
      const ropePositions = []
      const ropeIndices = []

      for (let i = 0; i < ropeNumSegments + 1; i++) {
        ropePositions.push(ropePos.x, ropePos.y + i * segmentLength, ropePos.z)
      }

      for (let i = 0; i < ropeNumSegments; i++) {
        ropeIndices.push(i, i + 1)
      }

      const ropeGeometry = new Cesium.Geometry({
        attributes: {
          position: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: new Float32Array(ropePositions)
          })
        },
        indices: new Uint16Array(ropeIndices),
        primitiveType: Cesium.PrimitiveType.LINES,
        boundingSphere: Cesium.BoundingSphere.fromVertices(ropePositions)
      })

      rope = new Mesh(ropeGeometry, ropeMaterial)
      meshVisualizer.add(rope)

      // Rope physic object
      const softBodyHelpers = new Ammo.btSoftBodyHelpers()
      const ropeStart = new Ammo.btVector3(ropePos.x, ropePos.y, ropePos.z)
      const ropeEnd = new Ammo.btVector3(ropePos.x, ropePos.y + ropeLength, ropePos.z)
      const ropeSoftBody = softBodyHelpers.CreateRope(physicsWorld.getWorldInfo(), ropeStart, ropeEnd, ropeNumSegments - 1, 0)
      const sbConfig = ropeSoftBody.get_m_cfg()
      sbConfig.set_viterations(10)
      sbConfig.set_piterations(10)
      ropeSoftBody.setTotalMass(ropeMass, false)
      Ammo.castObject(ropeSoftBody, Ammo.btCollisionObject)
        .getCollisionShape()
        .setMargin(margin * 3)
      physicsWorld.addSoftBody(ropeSoftBody, 1, -1)
      rope.physicsBody = ropeSoftBody
      // Disable deactivation
      ropeSoftBody.setActivationState(4)

      // The base
      const armMass = 2
      const armLength = 3
      const pylonHeight = ropePos.y + ropeLength
      const baseMaterial = createMaterial()
      pos.set(ropePos.x, 0.1, ropePos.z - armLength)
      quat.set(0, 0, 0, 1)
      const base = createParalellepiped(1, 0.2, 1, 0, pos, quat, baseMaterial)
      base.quaternion = null
      pos.set(ropePos.x, 0.5 * pylonHeight, ropePos.z - armLength)
      const pylon = createParalellepiped(0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial)
      pylon.quaternion = null

      pos.set(ropePos.x, pylonHeight + 0.2, ropePos.z - 0.5 * armLength)
      const arm = createParalellepiped(0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial)

      // Glue the rope extremes to the ball and the arm
      const influence = 1
      ropeSoftBody.appendAnchor(0, ball.physicsBody, true, influence)
      ropeSoftBody.appendAnchor(ropeNumSegments, arm.physicsBody, true, influence)

      // Hinge constraint to move the arm
      const pivotA = new Ammo.btVector3(0, pylonHeight * 0.5, 0)
      const pivotB = new Ammo.btVector3(0, -0.2, -armLength * 0.5)
      const axis = new Ammo.btVector3(0, 1, 0)
      hinge = new Ammo.btHingeConstraint(pylon.physicsBody, arm.physicsBody, pivotA, pivotB, axis, axis, true)
      physicsWorld.addConstraint(hinge, true)
    }

    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
      const box = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(sx, sy, sz),
        vertexFormat: new Cesium.VertexFormat({
          position: true,
          normal: true
        })
      })
      const threeObject = new Mesh(box, material)
      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
      shape.setMargin(margin)

      createRigidBody(threeObject, shape, mass, pos, quat)

      return threeObject
    }

    function createRigidBody(threeObject, physicsShape, mass, pos, quat) {
      threeObject.position.copy(pos)
      threeObject.quaternion = new Cesium.Quaternion(quat)

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

    function initInput() {
      window.addEventListener(
        "keydown",
        function (event) {
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

    function updatePhysics(deltaTime) {
      // Hinge control
      hinge.enableAngularMotor(true, 1.5 * armMovement, 50)

      // Step world
      physicsWorld.stepSimulation(deltaTime, 10)

      // Update rope
      const softBody = rope.physicsBody
      const ropePositions = rope.geometry.attributes.position.values
      const numVerts = ropePositions.length / 3
      const nodes = softBody.get_m_nodes()
      let indexFloat = 0
      for (let i = 0; i < numVerts; i++) {
        const node = nodes.at(i)
        const nodePos = node.get_m_x()
        ropePositions[indexFloat++] = nodePos.x()
        ropePositions[indexFloat++] = nodePos.y()
        ropePositions[indexFloat++] = nodePos.z()
      }
      rope.geometry.attributes.position.needsUpdate = true

      // Update rigid bodies
      for (let i = 0, il = rigidBodies.length; i < il; i++) {
        const objThree = rigidBodies[i]
        const objPhys = objThree.physicsBody
        const ms = objPhys.getMotionState()
        if (ms) {
          ms.getWorldTransform(transformAux1)
          const p = transformAux1.getOrigin()
          const q = transformAux1.getRotation()
          objThree.position.set(p.x(), p.y(), p.z())
          if (objThree.quaternion) {
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
          }
          objThree.modelMatrixNeedsUpdate = true
        }
      }
    }

    let init = false
    let start = false
    let startTime = new Date()
    function update(frameState) {
      const deltaTime = (new Date() - startTime) / 1000.0
      updatePhysics(deltaTime)

      startTime = new Date()
    }
    setTimeout(function () {
      if (!init) {
        // - Init -

        initPhysics()

        createObjects()

        initInput()

        init = true
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
