import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.834648, lng: 117.219733, alt: 83, heading: 64, pitch: -34 },
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
  const GeometryUtils = Cesium.GeometryUtils
  const MeshPhongMaterial = Cesium.MeshPhongMaterial
  const BasicMeshMaterial = Cesium.BasicMeshMaterial

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
  function createMaterial() {
    return new MeshPhongMaterial({
      defaultColor: createRandomColor(),
      side: Cesium.MeshMaterial.Sides.DOUBLE,
      translucent: false
    })
  }

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
    let clickRequest = false
    const mouseCoords = new Cesium.Cartesian2()
    const ballMaterial = createMaterial()
    const pos = new Cesium.Cartesian3()
    const quat = new Cesium.Quaternion()

    // Physics variables
    const gravityConstant = -9.8
    let collisionConfiguration
    let dispatcher
    let broadphase
    let solver
    let physicsWorld
    const rigidBodies = []
    const softBodies = []
    const margin = 0.05
    // let hinge
    const transformAux1 = new Ammo.btTransform()
    const softBodyHelpers = new Ammo.btSoftBodyHelpers()
    // const armMovement = 0
    const ray = new Cesium.Ray()
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
          defaultColor: "rgb(200,200,200)",
          side: Cesium.MeshMaterial.Sides.DOUBLE,
          translucent: false
        })
      )
      GeometryUtils.computeVertexNormals(ground.geometry)

      // Create soft volumes
      const volumeMass = 15

      const sphereGeometry = new THREE.SphereBufferGeometry(1.5, 40, 25)
      sphereGeometry.translate(5, 5, 0)
      createSoftVolume(sphereGeometry, volumeMass, 250)

      const boxGeometry = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(1, 1, 5, 4, 4, 20))
      boxGeometry.translate(-2, 5, 0)
      createSoftVolume(boxGeometry, volumeMass, 120)

      // Ramp
      pos.set(3, 1, 0)
      Cesium.Quaternion.fromAxisAngle(new Cesium.Cartesian3(0, 0, 1), (30 * Math.PI) / 180, quat)
      const obstacle = createParalellepiped(
        10,
        1,
        4,
        0,
        pos,
        quat,
        new MeshPhongMaterial({
          defaultColor: "rgb(28,28,28)",
          side: Cesium.MeshMaterial.Sides.DOUBLE,
          translucent: false
        })
      )
      GeometryUtils.computeVertexNormals(obstacle.geometry)
    }

    function processGeometry(bufGeometry) {
      // Obtain a Geometry
      const geometry = new THREE.Geometry().fromBufferGeometry(bufGeometry)

      // Merge the vertices so the triangle soup is converted to indexed triangles
      // const vertsDiff = geometry.mergeVertices()

      // Convert again to BufferGeometry, indexed
      const indexedBufferGeom = createIndexedBufferGeometryFromGeometry(geometry)

      // Create index arrays mapping the indexed vertices to bufGeometry vertices
      mapIndices(bufGeometry, indexedBufferGeom)
    }

    function createIndexedBufferGeometryFromGeometry(geometry) {
      const numVertices = geometry.vertices.length
      const numFaces = geometry.faces.length

      const bufferGeom = new THREE.BufferGeometry()
      const vertices = new Float32Array(numVertices * 3)
      const indices = new (numFaces * 3 > 65535 ? Uint32Array : Uint16Array)(numFaces * 3)

      for (let i = 0; i < numVertices; i++) {
        const p = geometry.vertices[i]

        const i3 = i * 3

        vertices[i3] = p.x
        vertices[i3 + 1] = p.y
        vertices[i3 + 2] = p.z
      }

      for (let i = 0; i < numFaces; i++) {
        const f = geometry.faces[i]

        const i3 = i * 3

        indices[i3] = f.a
        indices[i3 + 1] = f.b
        indices[i3 + 2] = f.c
      }

      bufferGeom.setIndex(new THREE.BufferAttribute(indices, 1))
      bufferGeom.addAttribute("position", new THREE.BufferAttribute(vertices, 3))

      return bufferGeom
    }

    function isEqual(x1, y1, z1, x2, y2, z2) {
      const delta = 0.000001
      return Math.abs(x2 - x1) < delta && Math.abs(y2 - y1) < delta && Math.abs(z2 - z1) < delta
    }

    function mapIndices(bufGeometry, indexedBufferGeom) {
      // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry

      const vertices = bufGeometry.attributes.position.array
      const idxVertices = indexedBufferGeom.attributes.position.array
      const indices = indexedBufferGeom.index.array

      const numIdxVertices = idxVertices.length / 3
      const numVertices = vertices.length / 3

      bufGeometry.ammoVertices = idxVertices
      bufGeometry.ammoIndices = indices
      bufGeometry.ammoIndexAssociation = []

      for (let i = 0; i < numIdxVertices; i++) {
        const association = []
        bufGeometry.ammoIndexAssociation.push(association)

        const i3 = i * 3

        for (let j = 0; j < numVertices; j++) {
          const j3 = j * 3
          if (isEqual(idxVertices[i3], idxVertices[i3 + 1], idxVertices[i3 + 2], vertices[j3], vertices[j3 + 1], vertices[j3 + 2])) {
            association.push(j3)
          }
        }
      }
    }

    function createSoftVolume(bufferGeom, mass, pressure) {
      processGeometry(bufferGeom)

      const volume = new Cesium.Mesh(
        bufferGeom,
        new BasicMeshMaterial({
          uniforms: {
            diffuseColorMap: "img/textures/colors.png"
          },
          translucent: false
        })
      )
      volume.geometry.ammoIndexAssociation = bufferGeom.ammoIndexAssociation

      meshVisualizer.add(volume)

      // Volume physic object

      const volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
        physicsWorld.getWorldInfo(),
        bufferGeom.ammoVertices,
        bufferGeom.ammoIndices,
        bufferGeom.ammoIndices.length / 3,
        true
      )

      const sbConfig = volumeSoftBody.get_m_cfg()
      sbConfig.set_viterations(40)
      sbConfig.set_piterations(40)

      // Soft-soft and soft-rigid collisions
      sbConfig.set_collisions(0x11)

      // Friction
      sbConfig.set_kDF(0.1)
      // Damping
      sbConfig.set_kDP(0.01)
      // Pressure
      sbConfig.set_kPR(pressure)
      // Stiffness
      volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9)
      volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9)

      volumeSoftBody.setTotalMass(mass, false)
      Ammo.castObject(volumeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin)
      physicsWorld.addSoftBody(volumeSoftBody, 1, -1)
      volume.physicsBody = volumeSoftBody
      // Disable deactivation
      volumeSoftBody.setActivationState(4)

      softBodies.push(volume)
    }

    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
      const box = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(sx, sy, sz),
        vertexFormat: new Cesium.VertexFormat({
          position: true,
          normal: true
        })
      })
      const threeObject = new Cesium.Mesh(box, material)

      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
      shape.setMargin(margin)

      createRigidBody(threeObject, shape, mass, pos, quat)

      return threeObject
    }

    function createRigidBody(threeObject, physicsShape, mass, pos, quat) {
      Cesium.Cartesian3.clone(pos, threeObject.position)
      if (!threeObject.quaternion) {
        threeObject.quaternion = new Cesium.Quaternion()
      }
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

      return body
    }

    function updatePhysics(deltaTime) {
      try {
        // Step world
        physicsWorld.stepSimulation(deltaTime, 10)

        // Update soft volumes
        for (let i = 0, il = softBodies.length; i < il; i++) {
          const volume = softBodies[i]
          const geometry = volume.geometry
          const softBody = volume.physicsBody
          const volumePositions = geometry.attributes.position.values
          const volumeNormals = geometry.attributes.normal.values
          const association = geometry.ammoIndexAssociation
          const numVerts = association.length
          const nodes = softBody.get_m_nodes()
          for (let j = 0; j < numVerts; j++) {
            const node = nodes.at(j)
            const nodePos = node.get_m_x()
            const x = nodePos.x()
            const y = nodePos.y()
            const z = nodePos.z()
            const nodeNormal = node.get_m_n()
            const nx = nodeNormal.x()
            const ny = nodeNormal.y()
            const nz = nodeNormal.z()

            const assocVertex = association[j]

            for (let k = 0, kl = assocVertex.length; k < kl; k++) {
              let indexVertex = assocVertex[k]
              volumePositions[indexVertex] = x
              volumeNormals[indexVertex] = nx
              indexVertex++
              volumePositions[indexVertex] = y
              volumeNormals[indexVertex] = ny
              indexVertex++
              volumePositions[indexVertex] = z
              volumeNormals[indexVertex] = nz
            }
          }

          geometry.attributes.position.needsUpdate = true
          geometry.attributes.normal.needsUpdate = true

          volume.modelMatrixNeedsUpdate = true
        }

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
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
            objThree.modelMatrixNeedsUpdate = true
          }
        }
      } catch (e) {
        meshVisualizer.beforeUpdate.removeEventListener(update)
        console.log("崩溃了", e)
      }
    }

    let start = false
    let init = false
    let startTime = new Date()
    const rayDir = new Cesium.Cartesian3()
    // const maxDistance = 100 // 发射点与射线和局部场景的交点的距离不能太远，过远会撕碎软体进而碎片过多时导致ammo物理引擎崩溃

    function initInput() {
      const scene = map.scene
      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
      // const lastMesh = null
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
        const ballMass = 3
        const ballRadius = 0.4

        const ball = new Cesium.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial)

        const ballShape = new Ammo.btSphereShape(ballRadius)
        ballShape.setMargin(margin)

        Cesium.Cartesian3.clone(ray.direction, rayDir)
        Cesium.Cartesian3.subtract(ray.origin, ray.direction, pos)

        quat.set(0, 0, 0, 1)
        const ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat)
        ballBody.setFriction(0.5)

        Cesium.Cartesian3.normalize(rayDir, rayDir)
        Cesium.Cartesian3.multiplyByScalar(rayDir, 30, rayDir)
        ballBody.setLinearVelocity(new Ammo.btVector3(rayDir.x, rayDir.y, rayDir.z))

        clickRequest = false
      }
    }
    function update(frameState) {
      const deltaTime = (new Date() - startTime) / 1000.0
      updatePhysics(deltaTime)
      processClick()
      startTime = new Date()
    }
    setTimeout(function () {
      if (!init) {
        // - Init -
        // initGraphics();

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
}
