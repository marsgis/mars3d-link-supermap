// eslint-disable-next-line no-undef
importScripts("/lib/mars3d/plugins/wind/mars3d-wind-worker.js")
const CanvasWindField = this["mars3d-wind"].CanvasWindField

let windField
self.onmessage = function (e) {
  const result = e.data

  switch (result.type) {
    case "init":
      windField = new CanvasWindField(result.options)
      break
    case "setOptions":
      windField.setOptions(result.options)
      break
    case "setDate":
      windField.setDate(result.data)
      break
    case "update": {
      const particles = windField.getParticles()
      self.postMessage({ particles })
      break
    }
    case "clear":
      windField.clear()
      break
  }
}

