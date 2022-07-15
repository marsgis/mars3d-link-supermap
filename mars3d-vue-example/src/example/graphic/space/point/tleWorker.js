

// eslint-disable-next-line no-undef
importScripts("/lib/mars3d/plugins/space/worker/mars3d-tle-worker.js")

// eslint-disable-next-line no-undef
const mars3d = mars3dTle

self.onmessage = function (e) {
  const arr = e.data.list
  const time = e.data.time

  const positionObj = {}
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    try {
      const position = mars3d.Tle.getEcfPosition(item.tle1, item.tle2, time) // 计算卫星位置
      if (position) {
        positionObj[item.id] = position
      }
    } catch (err) {
      continue
    }
  }

  // self代表子线程自身
  self.postMessage({ time: time, positionObj: positionObj })
  // self.close()
}
