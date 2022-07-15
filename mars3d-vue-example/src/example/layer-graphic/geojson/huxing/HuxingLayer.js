/**
 * 户型图 图层
 * @class HuxingLayer
 * @extends {mars3d.layer.GraphicLayer}
 */
class HuxingLayer extends mars3d.layer.GraphicLayer {
  /**
   * 对象添加到地图前创建一些对象的钩子方法，
   * 只会调用一次
   * @return {void}  无
   */
  _mountedHook() {
    //
  }

  /**
   * 对象添加到地图上的创建钩子方法，
   * 每次add时都会调用
   * @return {void}  无
   */
  _addedHook() {
    super._addedHook()
    this.load()

    this.on(mars3d.EventType.click, this._graphic_clickHandler, this)
    this._map.on(mars3d.EventType.clickMap, this._map_clickHandler, this)

    this.on(mars3d.EventType.mouseOver, this._graphic_mouseOverHandler, this)
    this.on(mars3d.EventType.mouseOut, this._graphic_mouseOutHandler, this)
  }

  /**
   * 对象从地图上移除的创建钩子方法，
   * 每次remove时都会调用
   * @return {void}  无
   */
  _removedHook() {
    super._removedHook()

    this.off(mars3d.EventType.click, this._graphic_clickHandler, this)
    this._map.off(mars3d.EventType.clickMap, this._map_clickHandler, this)

    this.off(mars3d.EventType.mouseOver, this._graphic_mouseOverHandler, this)
    this.off(mars3d.EventType.mouseOut, this._graphic_mouseOutHandler, this)
  }

  // 加载数据
  load(newOptions = {}) {
    this.options = {
      ...this.options,
      ...newOptions
    }

    if (this.options.url) {
      Cesium.Resource.fetchJson(this.options)
        .then((data) => {
          if (this._state === mars3d.State.REMOVED) {
            return
          }
          this._load_data(data)
        })
        .catch(function (error) {
          this.showError("服务出错", error)
        })
    } else if (this.options.data) {
      this._load_data(this.options.data)
    } else {
      console.warn("HuxinLayer：没有传入 url 或 data 参数,请确认是否有误。")
    }
  }

  _load_data(geojson) {
    this.clear()

    this._cache_huxin = {}

    const arr = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson
    for (let i = 0; i < arr.length; i++) {
      this.addHuxing(arr[i].positions, arr[i].attr)
    }

    if (this.options.flyTo) {
      this.flyTo({ scale: 2 })
    }

    this.fire(mars3d.EventType.load)
  }

  addHuxing(positions, attr) {
    if (!positions || positions.length === 0) {
      return
    }

    const flrH = attr.floorh || 0 // 底面高度
    const lyrH = attr.layerh || 0 // 楼层高度

    const primitiveBian = new mars3d.graphic.CorridorPrimitive({
      positions: positions,
      style: {
        height: flrH,
        diffHeight: lyrH,
        width: 0.2,
        cornerType: Cesium.CornerType.MITERED,
        color: "rgb(245,255,250)"
      },
      attr: attr
    })
    this.addGraphic(primitiveBian)

    const primitiveDi = new mars3d.graphic.PolygonEntity({
      positions: positions,
      style: {
        height: flrH,
        diffHeight: 0.1,
        color: "rgb(211,211,211)",
        outline: true,
        outlineWidth: 1,
        outlineColor: "#778899"
      },
      attr: attr
    })
    this.addGraphic(primitiveDi)

    // 记录到缓存中
    const loudongHao = attr.LDH // 楼栋号
    const cengHao = attr.CH // 层号

    this._cache_huxin[loudongHao] = this._cache_huxin[loudongHao] || {}
    this._cache_huxin[loudongHao][cengHao] = this._cache_huxin[loudongHao][cengHao] || []

    this._cache_huxin[loudongHao][cengHao].push(primitiveBian)
    this._cache_huxin[loudongHao][cengHao].push(primitiveDi)
  }

  _graphic_clickHandler(event) {
    // 将上次隐藏的层，恢复下
    this._map_clickHandler()

    const attr = event.graphic.attr

    const loudongHao = attr.LDH // 楼栋号
    const cengHao = attr.CH // 层号

    const loudongGraphics = this._cache_huxin[loudongHao]
    Object.keys(loudongGraphics).forEach((ceng) => {
      const showHu = Number(ceng) <= cengHao // 大于本层的隐藏不显示。

      const cengGraphics = loudongGraphics[ceng]
      cengGraphics.forEach((huGraphic) => {
        huGraphic.show = showHu
        if (!showHu) {
          this._lastHideGraphics.push(huGraphic)
        }
      })
    })
  }

  _map_clickHandler(event) {
    // 将上次隐藏的层，恢复下
    if (this._lastHideGraphics) {
      this._lastHideGraphics.forEach((huGraphic) => {
        huGraphic.show = true
      })
    }
    this._lastHideGraphics = []
  }

  _graphic_mouseOverHandler(event) {
    const graphic = event.graphic
    this.openSmallTooltip(event.windowPosition, graphic.attr.WZ)
  }

  _graphic_mouseOutHandler(event) {
    this.closeSmallTooltip()
  }
}
