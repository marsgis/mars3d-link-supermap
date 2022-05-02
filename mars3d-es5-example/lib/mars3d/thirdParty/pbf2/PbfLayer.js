//按mars3d规范，封装的pbf图层

(function (window) {
  let BasicRenderer = window.mapboxRenderer.BasicRenderer;

  // 创建一个全局变量作为pbfBasicRenderer渲染模板，避免出现16个canvas上下文的浏览器限制，以便Cesium ImageLayer.destory()正常工作。
  // https://github.com/mapbox/mapbox-gl-js/issues/7332
  const OFFSCREEN_CANV_SIZE = 1024;
  const baseCanv = document.createElement("canvas");
  baseCanv.style.imageRendering = "pixelated";
  baseCanv.addEventListener("webglcontextlost", () => console.log("webglcontextlost"), false);
  baseCanv.width = OFFSCREEN_CANV_SIZE;
  baseCanv.height = OFFSCREEN_CANV_SIZE;

  class MVTImageryProvider {
    /**
     * create a MVTImageryProvider Object
     * @param options MVTImageryProvider options
     * @param options.style - mapbox style object
     * @param options.sourceFilter - sourceFilter is used to filter which source participate in pickFeature process.
     * @param options.maximumLevel - if cesium zoom level exceeds maximumLevel, layer will be invisible.
     * @param options.minimumLevel - if cesium zoom level belows minimumLevel, layer will be invisible.
     * @param options.tileSize - can be 256 or 512. 256 default
     * @param options.headers - url fetch request headers
     * @param options.tilingScheme - Cesium tilingScheme, default WebMercatorTilingScheme(EPSG: 3857)
     */
    constructor(options) {
      this.options = options;

      let pbfStyle = options.style;
      this.mapboxRenderer = new BasicRenderer({
        style: pbfStyle,
        transformRequest: (url) => this.transformRequest(url),
      });

      this.mapboxRenderer._canvas = baseCanv;
      this.mapboxRenderer._canvas.addEventListener("webglcontextrestored", () => this.mapboxRenderer._createGlContext(), false);
      this.mapboxRenderer._createGlContext();

      if (options.showCanvas) {
        this.mapboxRenderer.showCanvasForDebug();
      }

      this.ready = false;
      this.readyPromise = this.mapboxRenderer._style.loadedPromise.then(() => {
        this.ready = true;
      });

      this.tilingScheme = options.tilingScheme ?? new Cesium.WebMercatorTilingScheme();
      this.rectangle = this.tilingScheme.rectangle;
      this.tileSize = this.tileWidth = this.tileHeight = options.tileSize || 1024;
      this.maximumLevel = options.maximumLevel || Number.MAX_SAFE_INTEGER;
      this.minimumLevel = options.minimumLevel || 0;
      this.tileDiscardPolicy = undefined;
      //this.errorEvent = new Cesium.Event();
      this.credit = new Cesium.Credit(options.credit || "", false);
      this.proxy = new Cesium.DefaultProxy("");
      this.hasAlphaChannel = options.hasAlphaChannel ?? true;
      this.sourceFilter = options.sourceFilter;
    }

    transformRequest = (url) => {
      if (this.options.headers) {
        return {
          url,
          headers: this.options.headers,
        };
      }
      return {
        url,
      };
    };

    createTile() {
      const canv = document.createElement("canvas");
      canv.width = this.tileSize;
      canv.height = this.tileSize;
      canv.style.imageRendering = "pixelated";
      const ctx = canv.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "copy";
      }
      return canv;
    }

    async canvasToImage(canvas) {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = function () {
          resolve(img);
        };
        img.crossOrigin = "";
        img.src = canvas.toDataURL("image/png");
      });
    }

    requestImage(x, y, zoom, releaseTile = true) {
      if (zoom > this.maximumLevel || zoom < this.minimumLevel) {
        return Promise.reject(undefined);
      }

      this.mapboxRenderer.filterForZoom(zoom);
      const tilesSpec = [];
      this.mapboxRenderer.getVisibleSources(zoom).forEach((s) => {
        tilesSpec.push({
          source: s,
          z: zoom,
          x: x,
          y: y,
          left: 0,
          top: 0,
          size: this.tileSize,
        });
      });

      return new Promise((resolve, reject) => {
        const canv = this.createTile();
        const renderRef = this.mapboxRenderer.renderTiles(
          canv.getContext("2d"),
          {
            srcLeft: 0,
            srcTop: 0,
            width: this.tileSize,
            height: this.tileSize,
            destLeft: 0,
            destTop: 0,
          },
          tilesSpec,
          async (err) => {
            if (!!err) {
              switch (err) {
                case "canceled":
                case "fully-canceled":
                  reject(undefined);
                  break;
                default:
                  reject(undefined);
              }
            } else {
              if (releaseTile) {
                renderRef.consumer.ctx = null;
                const img = await this.canvasToImage(canv);
                resolve(img);
                // releaseTile默认为true，对应Cesium请求图像的情形
                this.mapboxRenderer.releaseRender(renderRef);
                this.mapboxRenderer._style.sourceCaches?.origin?._tileCache.reset();
              } else {
                // releaseTile为false时在由pickFeature手动调用，在渲染完成之后在pickFeature里边手动释放tile
                resolve(renderRef);
              }
            }
          }
        );
      });
    }

    pickFeatures(x, y, zoom, longitude, latitude) {
      return this.requestImage(x, y, zoom, false)?.then((renderRef) => {
        let targetSources = this.mapboxRenderer.getVisibleSources(zoom);
        targetSources = this.sourceFilter ? this.sourceFilter(targetSources) : targetSources;

        const queryResult = [];

        const lng = Cesium.Math.toDegrees(longitude);
        const lat = Cesium.Math.toDegrees(latitude);

        targetSources.forEach((s) => {
          queryResult.push({
            data: this.mapboxRenderer.queryRenderedFeatures({
              source: s,
              renderedZoom: zoom,
              lng,
              lat,
              tileZ: zoom,
            }),
          });
        });

        console.log(queryResult);

        // release tile
        renderRef.consumer.ctx = undefined;
        this.mapboxRenderer.releaseRender(renderRef);
        this.mapboxRenderer._style.sourceCaches?.origin?._tileCache.reset();
        return queryResult;
      });
    }
  }

  class PbfLayer extends mars3d.layer.BaseTileLayer {
    //构建ImageryProvider
    _createImageryProvider(options) {
      return createImageryProvider(options);
    }
  }

  function createImageryProvider(options) {
    if (options.url) {
      return Cesium.Resource.fetchJson(options).then((data) => {
        return new MVTImageryProvider({ ...options, style: data });
      });
    } else {
      return new MVTImageryProvider(options);
    }
  }

  PbfLayer.createImageryProvider = createImageryProvider;

  //注册下
  const layerType = "pbf"; //图层类型
  mars3d.LayerUtil.register(layerType, PbfLayer);
  mars3d.LayerUtil.registerImageryProvider(layerType, createImageryProvider);

  //对外接口
  window.mars3d.layer.PbfLayer = PbfLayer;
})(window);
